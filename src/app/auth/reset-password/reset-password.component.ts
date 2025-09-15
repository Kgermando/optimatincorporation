import { Component, OnInit } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <h2>Réinitialiser le mot de passe</h2>
          <p>Entrez votre nouveau mot de passe</p>
        </div>
        
        <form [formGroup]="resetPasswordForm" (ngSubmit)="onSubmit()" class="auth-form">
          <div class="form-group">
            <label for="password">Nouveau mot de passe *</label>
            <input 
              type="password" 
              id="password"
              formControlName="password"
              class="form-control"
              [class.is-invalid]="isFieldInvalid('password')"
              placeholder="Entrez votre nouveau mot de passe"
            />
            <div class="invalid-feedback" *ngIf="isFieldInvalid('password')">
              <span *ngIf="resetPasswordForm.get('password')?.hasError('required')">
                Le mot de passe est requis
              </span>
              <span *ngIf="resetPasswordForm.get('password')?.hasError('minlength')">
                Le mot de passe doit contenir au moins 6 caractères
              </span>
            </div>
          </div>

          <div class="form-group">
            <label for="password_confirm">Confirmer le mot de passe *</label>
            <input 
              type="password" 
              id="password_confirm"
              formControlName="password_confirm"
              class="form-control"
              [class.is-invalid]="isFieldInvalid('password_confirm')"
              placeholder="Confirmez votre nouveau mot de passe"
            />
            <div class="invalid-feedback" *ngIf="isFieldInvalid('password_confirm')">
              <span *ngIf="resetPasswordForm.get('password_confirm')?.hasError('required')">
                La confirmation du mot de passe est requise
              </span>
              <span *ngIf="resetPasswordForm.get('password_confirm')?.hasError('passwordMismatch')">
                Les mots de passe ne correspondent pas
              </span>
            </div>
          </div>

          <div class="form-actions">
            <button 
              type="submit" 
              class="btn btn-primary btn-block"
              [disabled]="isLoading || resetPasswordForm.invalid"
            >
              <span *ngIf="isLoading" class="spinner-border spinner-border-sm me-2"></span>
              {{ isLoading ? 'Réinitialisation...' : 'Réinitialiser le mot de passe' }}
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
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm!: FormGroup;
  isLoading = false;
  year: string;
  resetToken: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {
    this.year = formatDate(new Date(), 'yyyy', 'en');
  }

  ngOnInit() {
    // Récupérer le token depuis l'URL
    this.resetToken = this.route.snapshot.paramMap.get('token') || '';
    
    if (!this.resetToken) {
      this.toastr.error('Token de réinitialisation manquant', 'Erreur');
      this.router.navigate(['/auth/login']);
      return;
    }

    this.resetPasswordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      password_confirm: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const passwordConfirm = form.get('password_confirm');

    if (password && passwordConfirm && password.value !== passwordConfirm.value) {
      passwordConfirm.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    return null;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.resetPasswordForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onSubmit(): void {
    if (this.resetPasswordForm.valid) {
      this.isLoading = true;

      const formValue = this.resetPasswordForm.value;

      this.authService.resetPassword(this.resetToken, {
        password: formValue.password,
        password_confirm: formValue.password_confirm
      }).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.toastr.success('Mot de passe réinitialisé avec succès', 'Succès');
          this.router.navigate(['/auth/login']);
        },
        error: (error) => {
          this.isLoading = false;
          this.toastr.error(error.message || 'Erreur lors de la réinitialisation du mot de passe', 'Erreur');
        }
      });
    } else {
      Object.keys(this.resetPasswordForm.controls).forEach(key => {
        this.resetPasswordForm.get(key)?.markAsTouched();
      });
    }
  }
}