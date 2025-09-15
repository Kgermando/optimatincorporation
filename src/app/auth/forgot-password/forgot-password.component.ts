import { Component, OnInit } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <h2>Mot de passe oublié</h2>
          <p>Entrez votre adresse email pour recevoir un lien de réinitialisation</p>
        </div>
        
        <form [formGroup]="forgotPasswordForm" (ngSubmit)="onSubmit()" class="auth-form">
          <div class="form-group">
            <label for="email">Email *</label>
            <input 
              type="email" 
              id="email"
              formControlName="email"
              class="form-control"
              [class.is-invalid]="isFieldInvalid('email')"
              placeholder="Entrez votre adresse email"
            />
            <div class="invalid-feedback" *ngIf="isFieldInvalid('email')">
              <span *ngIf="forgotPasswordForm.get('email')?.hasError('required')">
                L'email est requis
              </span>
              <span *ngIf="forgotPasswordForm.get('email')?.hasError('email')">
                Format d'email invalide
              </span>
            </div>
          </div>

          <div class="form-actions">
            <button 
              type="submit" 
              class="btn btn-primary btn-block"
              [disabled]="isLoading || forgotPasswordForm.invalid"
            >
              <span *ngIf="isLoading" class="spinner-border spinner-border-sm me-2"></span>
              {{ isLoading ? 'Envoi en cours...' : 'Envoyer le lien' }}
            </button>
          </div>

          <div class="auth-links">
            <a routerLink="/auth/login" class="link">Retour à la connexion</a>
          </div>
        </form>

        <div class="auth-footer">
          <p>&copy; {{ year }} Optimat Incorporation. Tous droits réservés.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #f8f9fa;
      padding: 20px;
    }

    .auth-card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      padding: 40px;
      width: 100%;
      max-width: 400px;
    }

    .auth-header {
      text-align: center;
      margin-bottom: 30px;
    }

    .auth-header h2 {
      color: #333;
      margin-bottom: 10px;
    }

    .auth-header p {
      color: #666;
      font-size: 14px;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-group label {
      display: block;
      margin-bottom: 8px;
      color: #333;
      font-weight: 500;
    }

    .form-control {
      width: 100%;
      padding: 12px 15px;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 14px;
      transition: border-color 0.3s;
    }

    .form-control:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
    }

    .form-control.is-invalid {
      border-color: #dc3545;
    }

    .invalid-feedback {
      color: #dc3545;
      font-size: 12px;
      margin-top: 5px;
    }

    .btn {
      padding: 12px 20px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      transition: all 0.3s;
    }

    .btn-primary {
      background-color: #007bff;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background-color: #0056b3;
    }

    .btn-primary:disabled {
      background-color: #6c757d;
      cursor: not-allowed;
    }

    .btn-block {
      width: 100%;
    }

    .auth-links {
      text-align: center;
      margin-top: 20px;
    }

    .link {
      color: #007bff;
      text-decoration: none;
      font-size: 14px;
    }

    .link:hover {
      text-decoration: underline;
    }

    .auth-footer {
      text-align: center;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #eee;
    }

    .auth-footer p {
      color: #666;
      font-size: 12px;
      margin: 0;
    }

    .spinner-border-sm {
      width: 1rem;
      height: 1rem;
    }
  `]
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm!: FormGroup;
  isLoading = false;
  year: string;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.year = formatDate(new Date(), 'yyyy', 'en');
  }

  ngOnInit() {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.forgotPasswordForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onSubmit(): void {
    if (this.forgotPasswordForm.valid) {
      this.isLoading = true;

      const email = this.forgotPasswordForm.value.email;

      this.authService.forgotPassword({ email }).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.toastr.success('Un lien de réinitialisation a été envoyé à votre adresse email', 'Email envoyé');
          this.router.navigate(['/auth/login']);
        },
        error: (error) => {
          this.isLoading = false;
          this.toastr.error(error.message || 'Erreur lors de l\'envoi de l\'email', 'Erreur');
        }
      });
    } else {
      Object.keys(this.forgotPasswordForm.controls).forEach(key => {
        this.forgotPasswordForm.get(key)?.markAsTouched();
      });
    }
  }
}