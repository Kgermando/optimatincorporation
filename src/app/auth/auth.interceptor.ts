import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private router: Router
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Ne pas ajouter le token pour les requêtes d'authentification
    const isAuthRequest = req.url.includes('/auth/login') || 
                         req.url.includes('/auth/register') ||
                         req.url.includes('/auth/forgot-password') ||
                         req.url.includes('/auth/reset/') ||
                         req.url.includes('/auth/create-admin');

    if (!isAuthRequest && typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      
      if (token) {
        // Ajouter le token dans les paramètres de requête pour correspondre au backend Go
        const params = req.params.set('token', token);
        req = req.clone({ params });
      }
    }

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // Token expiré ou invalide, rediriger vers la page de connexion
          if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            localStorage.removeItem('currentUser');
          }
          this.router.navigate(['/auth/login']);
        }
        return throwError(() => error);
      })
    );
  }
}