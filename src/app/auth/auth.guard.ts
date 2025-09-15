import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    // Vérification simple avec localStorage
    if (this.authService.isAuthentication()) {
      // Optionnel : Vérifier la validité du token avec le serveur
      return this.authService.user().pipe(
        map(user => {
          if (user) {
            return true;
          } else {
            this.redirectToLogin(state.url);
            return false;
          }
        }),
        catchError(() => {
          this.redirectToLogin(state.url);
          return of(false);
        })
      );
    } else {
      this.redirectToLogin(state.url);
      return false;
    }
  }

  private redirectToLogin(url: string): void {
    // Rediriger vers admin/login pour les routes admin
    if (url.includes('/admin/')) {
      this.router.navigate(['/admin/login']);
    } else {
      this.router.navigate(['/auth/login']);
    }
  }
}
