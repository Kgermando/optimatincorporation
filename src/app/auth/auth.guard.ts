import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    // Vérification simple avec localStorage
    if (this.authService.isAuthentification()) {
      return true;
    } else {
      // Rediriger vers admin/login pour les routes admin
      if (state.url.includes('/admin/')) {
        this.router.navigate(['/admin/login']);
      } else {
        this.router.navigate(['/auth/login']);
      }
      return false;
    }
  }
}
