import { Component, signal, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { LoginRequest } from '../../core/models';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  loading = signal(false);
  error = signal('');

  credentials: LoginRequest = { email: '', password: '' };

  login(): void {
    if (!this.credentials.email || !this.credentials.password) return;
    this.loading.set(true);
    this.error.set('');

    this.authService.login(this.credentials).subscribe({
      next: () => this.router.navigate(['/admin/dashboard']),
      error: () => {
        this.error.set('Email ou mot de passe incorrect.');
        this.loading.set(false);
      }
    });
  }
}
