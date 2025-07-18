import { Component } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="register-card">
      <div class="register-header">
        <img src="assets/img/logo.png" alt="Logo" class="logo">
        <h2>Inscription</h2>
        <p>Créez votre compte</p>
      </div>
      
      <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="register-form">
        <div class="row">
          <div class="col-md-6">
            <div class="form-group">
              <label for="fullname">Nom complet</label>
              <input 
                type="text" 
                id="fullname" 
                formControlName="fullname"
                class="form-control"
                [class.is-invalid]="isFieldInvalid('fullname')"
                placeholder="Nom complet"
              >
              <div *ngIf="isFieldInvalid('fullname')" class="invalid-feedback">
                Nom complet requis
              </div>
            </div>
          </div>
          
          <div class="col-md-6">
            <div class="form-group">
              <label for="email">Email</label>
              <input 
                type="email" 
                id="email" 
                formControlName="email"
                class="form-control"
                [class.is-invalid]="isFieldInvalid('email')"
                placeholder="Adresse email"
              >
              <div *ngIf="isFieldInvalid('email')" class="invalid-feedback">
                Email requis et valide
              </div>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-md-6">
            <div class="form-group">
              <label for="phone">Téléphone</label>
              <input 
                type="text" 
                id="phone" 
                formControlName="phone"
                class="form-control"
                [class.is-invalid]="isFieldInvalid('phone')"
                placeholder="Numéro de téléphone"
              >
              <div *ngIf="isFieldInvalid('phone')" class="invalid-feedback">
                Téléphone requis
              </div>
            </div>
          </div>
          
          <div class="col-md-6">
            <div class="form-group">
              <label for="title">Titre</label>
              <input 
                type="text" 
                id="title" 
                formControlName="title"
                class="form-control"
                [class.is-invalid]="isFieldInvalid('title')"
                placeholder="Titre/Poste"
              >
              <div *ngIf="isFieldInvalid('title')" class="invalid-feedback">
                Titre requis
              </div>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-md-6">
            <div class="form-group">
              <label for="password">Mot de passe</label>
              <input 
                type="password" 
                id="password" 
                formControlName="password"
                class="form-control"
                [class.is-invalid]="isFieldInvalid('password')"
                placeholder="Mot de passe"
              >
              <div *ngIf="isFieldInvalid('password')" class="invalid-feedback">
                Mot de passe requis (min 6 caractères)
              </div>
            </div>
          </div>
          
          <div class="col-md-6">
            <div class="form-group">
              <label for="password_confirm">Confirmer le mot de passe</label>
              <input 
                type="password" 
                id="password_confirm" 
                formControlName="password_confirm"
                class="form-control"
                [class.is-invalid]="isFieldInvalid('password_confirm')"
                placeholder="Confirmer le mot de passe"
              >
              <div *ngIf="isFieldInvalid('password_confirm')" class="invalid-feedback">
                Les mots de passe ne correspondent pas
              </div>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-md-6">
            <div class="form-group">
              <label for="role">Rôle</label>
              <select 
                id="role" 
                formControlName="role"
                class="form-control"
                [class.is-invalid]="isFieldInvalid('role')"
              >
                <option value="">Sélectionner un rôle</option>
                <option value="Admin">Admin</option>
                <option value="User">User</option>
                <option value="Support">Support</option>
              </select>
              <div *ngIf="isFieldInvalid('role')" class="invalid-feedback">
                Rôle requis
              </div>
            </div>
          </div>
          
          <div class="col-md-6">
            <div class="form-group">
              <label for="permission">Permission</label>
              <select 
                id="permission" 
                formControlName="permission"
                class="form-control"
                [class.is-invalid]="isFieldInvalid('permission')"
              >
                <option value="">Sélectionner une permission</option>
                <option value="CR">CR</option>
                <option value="CRU">CRU</option>
                <option value="RU">RU</option>
                <option value="CRUD">CRUD</option>
              </select>
              <div *ngIf="isFieldInvalid('permission')" class="invalid-feedback">
                Permission requise
              </div>
            </div>
          </div>
        </div>

        <div class="form-check">
          <input 
            class="form-check-input" 
            type="checkbox" 
            id="status" 
            formControlName="status"
          >
          <label class="form-check-label" for="status">
            Activer le compte
          </label>
        </div>

        <div *ngIf="error" class="alert alert-danger">
          {{ error }}
        </div>

        <button 
          type="submit" 
          class="btn btn-primary btn-block"
          [disabled]="registerForm.invalid || isLoading"
        >
          <span *ngIf="isLoading" class="spinner-border spinner-border-sm me-2"></span>
          {{ isLoading ? 'Création...' : 'Créer le compte' }}
        </button>
        
        <div class="text-center mt-3">
          <p>Déjà un compte? <a routerLink="/auth/login">Se connecter</a></p>
        </div>
      </form>
      
      <div class="footer">
        <p>&copy; <a href="http://ictech.dev" target="_blank">ICTECH {{year}}</a></p>
      </div>
    </div>
  `,
  styles: [`
    .register-card {
      background: white;
      border-radius: 10px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
      padding: 40px;
      width: 100%;
      max-width: 800px;
    }

    .register-header {
      text-align: center;
      margin-bottom: 30px;
    }

    .logo {
      height: 60px;
      margin-bottom: 20px;
    }

    .register-header h2 {
      color: #333;
      margin-bottom: 10px;
    }

    .register-header p {
      color: #666;
      margin: 0;
    }

    .row {
      display: flex;
      flex-wrap: wrap;
      margin: -10px;
    }

    .col-md-6 {
      flex: 0 0 50%;
      max-width: 50%;
      padding: 10px;
    }

    @media (max-width: 768px) {
      .col-md-6 {
        flex: 0 0 100%;
        max-width: 100%;
      }
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
      box-sizing: border-box;
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
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;
  error: string | null = null;
  year: string;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.year = formatDate(new Date(), 'yyyy', 'en');
    this.registerForm = this.fb.group({
      fullname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      title: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      password_confirm: ['', [Validators.required]],
      role: ['User', [Validators.required]],
      permission: ['CR', [Validators.required]],
      status: [true],
      signature: [''],
      entreprise: ['OPTIMAT INCORPORATION']
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
    const field = this.registerForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.error = null;

      this.authService.register(this.registerForm.value).subscribe({
        next: (response) => {
          this.isLoading = false;
          // Redirection vers la page de connexion
          this.router.navigate(['/auth/login']);
        },
        error: (error) => {
          this.isLoading = false;
          this.error = error.error?.message || 'Erreur lors de la création du compte.';
        }
      });
    }
  }
}
