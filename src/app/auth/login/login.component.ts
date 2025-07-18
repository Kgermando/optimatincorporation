import { Component } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="login-card">
      <div class="login-header">
        <img src="assets/img/logo.png" alt="Logo" class="logo">
        <h2>Connexion</h2>
        <p>Connectez-vous à votre compte</p>
      </div>
      
      <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
        <div class="form-group">
          <label for="email">Email</label>
          <input 
            type="email" 
            id="email" 
            formControlName="email"
            class="form-control"
            [class.is-invalid]="isFieldInvalid('email')"
            placeholder="Votre adresse email"
          >
          <div *ngIf="isFieldInvalid('email')" class="invalid-feedback">
            Email requis et valide
          </div>
        </div>

        <div class="form-group">
          <label for="password">Mot de passe</label>
          <input 
            type="password" 
            id="password" 
            formControlName="password"
            class="form-control"
            [class.is-invalid]="isFieldInvalid('password')"
            placeholder="Votre mot de passe"
          >
          <div *ngIf="isFieldInvalid('password')" class="invalid-feedback">
            Mot de passe requis
          </div>
        </div>

        <div class="form-check">
          <input class="form-check-input" type="checkbox" id="remember" value="true">
          <label class="form-check-label" for="remember">
            Se souvenir de moi
          </label>
        </div>

        <div *ngIf="error" class="alert alert-danger">
          {{ error }}
        </div>

        <button 
          type="submit" 
          class="btn btn-primary btn-block"
          [disabled]="loginForm.invalid || isLoading"
        >
          <span *ngIf="isLoading" class="spinner-border spinner-border-sm me-2"></span>
          {{ isLoading ? 'Connexion...' : 'Se connecter' }}
        </button>
        
        <div class="text-center mt-3">
          <p>Pas encore de compte? <a routerLink="/auth/register">Créer un compte</a></p>
        </div>
      </form>
      
      <div class="footer">
        <p>&copy; <a href="http://ictech.dev" target="_blank">ICTECH {{year}}</a></p>
      </div>
    </div>
  `,
  styles: [`
    .login-card {
      background: white;
      border-radius: 10px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
      padding: 40px;
      width: 100%;
      max-width: 400px;
    }

    .login-header {
      text-align: center;
      margin-bottom: 30px;
    }

    .logo {
      height: 60px;
      margin-bottom: 20px;
    }

    .login-header h2 {
      color: #333;
      margin-bottom: 10px;
    }

    .login-header p {
      color: #666;
      margin: 0;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-group label {
      display: block;
      margin-bottom: 5px;
      color: #333;
      font-weight: 500;
    }

    .form-control {
      width: 100%;
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 5px;
      font-size: 16px;
      transition: border-color 0.3s;
    }

    .form-control:focus {
      border-color: #667eea;
      outline: none;
      box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
    }

    .form-control.is-invalid {
      border-color: #dc3545;
    }

    .invalid-feedback {
      color: #dc3545;
      font-size: 14px;
      margin-top: 5px;
    }

    .form-check {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
    }

    .form-check-input {
      margin-right: 8px;
    }

    .btn {
      width: 100%;
      padding: 12px;
      border: none;
      border-radius: 5px;
      font-size: 16px;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.3s;
    }

    .btn-primary {
      background-color: #667eea;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background-color: #5a6fd8;
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .alert {
      padding: 12px;
      border-radius: 5px;
      margin-bottom: 20px;
    }

    .alert-danger {
      background-color: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
    }

    .spinner-border-sm {
      width: 1rem;
      height: 1rem;
    }

    .footer {
      text-align: center;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #eee;
    }

    .footer p {
      color: #666;
      margin: 0;
    }

    .footer a {
      color: #667eea;
      text-decoration: none;
    }

    .footer a:hover {
      text-decoration: underline;
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  error: string | null = null;
  year: string;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.year = formatDate(new Date(), 'yyyy', 'en');
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.error = null;

      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          this.isLoading = false;
          // Redirection based on user role
          if (response.user.role === 'Admin') {
            this.router.navigate(['/admin/dashboard']);
          } else {
            this.router.navigate(['/']);
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.error = error.error?.message || 'Erreur de connexion. Vérifiez vos identifiants.';
        }
      });
    }
  }
}
