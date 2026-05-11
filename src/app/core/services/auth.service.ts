import { Injectable, signal, computed, PLATFORM_ID, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { AuthResponse, LoginRequest, User } from '../models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  private _currentUser = signal<User | null>(null);
  currentUser = computed(() => this._currentUser());
  isAuthenticated = computed(() => this._currentUser() !== null);

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    if (isPlatformBrowser(this.platformId)) {
      const userData = localStorage.getItem('optimat_user');
      if (userData) {
        try {
          this._currentUser.set(JSON.parse(userData));
        } catch {
          this.clearStorage();
        }
      }
    }
  }

  login(credentials: LoginRequest) {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, credentials).pipe(
      tap(res => {
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('optimat_token', res.token);
          localStorage.setItem('optimat_user', JSON.stringify(res.user));
        }
        this._currentUser.set(res.user);
      })
    );
  }

  logout(): void {
    this.clearStorage();
    this._currentUser.set(null);
    this.router.navigate(['/admin/login']);
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('optimat_token');
    }
    return null;
  }

  private clearStorage(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('optimat_token');
      localStorage.removeItem('optimat_user');
    }
  }
}
