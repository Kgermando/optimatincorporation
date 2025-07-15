import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { LoginRequest, LoginResponse, AuthState, AdminUser } from './models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends ApiService {
  private authStateSubject = new BehaviorSubject<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null
  });

  public authState$ = this.authStateSubject.asObservable();

  constructor(http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {
    super(http);
    this.loadAuthState();
  }

  private loadAuthState(): void {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('admin_token');
      const user = localStorage.getItem('admin_user');
      
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
    return this.post<LoginResponse>('/auth/login', credentials).pipe(
      tap((response) => {
        this.setAuthState(response);
      })
    );
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
    }
    this.authStateSubject.next({
      isAuthenticated: false,
      user: null,
      token: null
    });
  }

  private setAuthState(response: LoginResponse): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('admin_token', response.token);
      localStorage.setItem('admin_user', JSON.stringify(response.user));
    }
    
    this.authStateSubject.next({
      isAuthenticated: true,
      user: response.user,
      token: response.token
    });
  }

  getToken(): string | null {
    return this.authStateSubject.value.token;
  }

  isAuthenticated(): boolean {
    return this.authStateSubject.value.isAuthenticated;
  }

  getCurrentUser(): AdminUser | null {
    return this.authStateSubject.value.user;
  }

  protected override getHeaders() {
    const headers = super.getHeaders();
    const token = this.getToken();
    
    if (token) {
      return headers.set('Authorization', `Bearer ${token}`);
    }
    
    return headers;
  }
}
