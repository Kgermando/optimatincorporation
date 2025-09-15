import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { 
  UserModel, 
  LoginRequest, 
  LoginResponse, 
  RegisterRequest, 
  RegisterResponse,
  UpdateInfoRequest,
  UpdateInfoResponse,
  ChangePasswordRequest,
  ChangePasswordResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ApiError
} from './models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly API_URL = `${environment.apiUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<UserModel | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    // Charger l'utilisateur depuis le localStorage au démarrage
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('currentUser');
      
      if (token && userData) {
        try {
          const user = JSON.parse(userData);
          this.currentUserSubject.next(user);
        } catch (error) {
          console.error('Erreur lors du chargement des données utilisateur:', error);
          this.clearStorage();
        }
      }
    }
  }

  private clearStorage(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('currentUser');
    }
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Une erreur est survenue';
    
    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return throwError(() => ({ message: errorMessage }));
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_URL}/login`, credentials)
      .pipe(
        tap(response => {
          if (response.data?.token && response.data?.user) {
            // Sauvegarder le token et les données utilisateur
            if (typeof window !== 'undefined') {
              localStorage.setItem('token', response.data.token);
              localStorage.setItem('currentUser', JSON.stringify(response.data.user));
            }
            this.currentUserSubject.next(response.data.user);
          }
        }),
        catchError(this.handleError)
      );
  }

  register(data: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.API_URL}/register`, data)
      .pipe(
        catchError(this.handleError)
      );
  }

  user(): Observable<UserModel | null> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => ({ message: 'Token manquant' }));
    }

    return this.http.get<UserModel>(`${this.API_URL}/user`, {
      params: { token }
    }).pipe(
      tap(user => {
        if (user) {
          if (typeof window !== 'undefined') {
            localStorage.setItem('currentUser', JSON.stringify(user));
          }
          this.currentUserSubject.next(user);
        }
      }),
      catchError(this.handleError)
    );
  }

  getCurrentUser(): UserModel | null {
    return this.currentUserSubject.value;
  }

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  }

  isAuthentication(): boolean {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('currentUser');
      return !!token && !!userData;
    }
    return false;
  }

  logout(): Observable<any> {
    return this.http.post(`${this.API_URL}/logout`, {})
      .pipe(
        tap(() => {
          this.clearStorage();
          this.currentUserSubject.next(null);
        }),
        catchError((error) => {
          // Même en cas d'erreur, on déconnecte localement
          this.clearStorage();
          this.currentUserSubject.next(null);
          return throwError(() => error);
        })
      );
  }

  updateInfo(data: UpdateInfoRequest): Observable<UpdateInfoResponse> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => ({ message: 'Token manquant' }));
    }

    return this.http.put<UpdateInfoResponse>(`${this.API_URL}/update-info`, data, {
      params: { token }
    }).pipe(
      tap(response => {
        if (response.data) {
          if (typeof window !== 'undefined') {
            localStorage.setItem('currentUser', JSON.stringify(response.data));
          }
          this.currentUserSubject.next(response.data);
        }
      }),
      catchError(this.handleError)
    );
  }

  updatePassword(data: ChangePasswordRequest): Observable<ChangePasswordResponse> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => ({ message: 'Token manquant' }));
    }

    return this.http.put<ChangePasswordResponse>(`${this.API_URL}/change-password`, data, {
      params: { token }
    }).pipe(
      catchError(this.handleError)
    );
  }

  forgotPassword(data: ForgotPasswordRequest): Observable<any> {
    return this.http.post(`${this.API_URL}/forgot-password`, data)
      .pipe(
        catchError(this.handleError)
      );
  }

  resetPassword(token: string, data: ResetPasswordRequest): Observable<any> {
    return this.http.post(`${this.API_URL}/reset/${token}`, data)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Méthode pour créer un utilisateur admin (développement seulement)
  createAdmin(): Observable<any> {
    return this.http.post(`${this.API_URL}/create-admin`, {})
      .pipe(
        catchError(this.handleError)
      );
  }
}