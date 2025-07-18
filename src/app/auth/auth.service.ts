import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { UserModel, LoginRequest, LoginResponse, RegisterRequest, AuthState } from './models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authStateSubject = new BehaviorSubject<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null
  });

  public authState$ = this.authStateSubject.asObservable();

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.loadAuthState();
  }

  private loadAuthState(): void {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('authToken');
      const user = localStorage.getItem('authUser');
      
      if (token && user) {
        this.authStateSubject.next({
          isAuthenticated: true,
          user: JSON.parse(user),
          token: token
        });
      }
    }
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, credentials, {
      withCredentials: true
    }).pipe(
      tap((response) => {
        this.setAuthState(response);
      })
    );
  }

  register(userData: RegisterRequest): Observable<UserModel> {
    return this.http.post<UserModel>(`${environment.apiUrl}/auth/register`, userData);
  }

  user(): Observable<UserModel> {
    return this.http.get<UserModel>(`${environment.apiUrl}/auth/user`);
  }

  logout(): Observable<void> {
    const logoutRequest = this.http.post<void>(`${environment.apiUrl}/auth/logout`, {});
    
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
    }
    
    this.authStateSubject.next({
      isAuthenticated: false,
      user: null,
      token: null
    });

    return logoutRequest;
  }

  private setAuthState(response: LoginResponse): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('authUser', JSON.stringify(response.user));
    }
    
    this.authStateSubject.next({
      isAuthenticated: true,
      user: response.user,
      token: response.token
    });
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('authToken');
    }
    return this.authStateSubject.value.token;
  }

  isAuthenticated(): boolean {
    return this.authStateSubject.value.isAuthenticated;
  }

  getCurrentUser(): UserModel | null {
    return this.authStateSubject.value.user;
  }

  updateInfo(data: any): Observable<UserModel> {
    return this.http.put<UserModel>(`${environment.apiUrl}/auth/profil/info`, data);
  }

  updatePassword(data: any): Observable<UserModel> {
    return this.http.put<UserModel>(`${environment.apiUrl}/auth/change-password`, data);
  }
}
