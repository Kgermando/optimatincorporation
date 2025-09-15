import { Component, OnInit } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../auth.service';
import { RegisterRequest } from '../models/user.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  isLoading = false;
  error: string | null = null;
  year: string = "2025";
  canRegister = true;
  registrationMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {

  }

  ngOnInit() {
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
    },
    { validators: this.passwordMatchValidator });
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

      const formValue = this.registerForm.value;

      const registerData: RegisterRequest = {
        fullname: formValue.fullname,
        email: formValue.email,
        phone: formValue.phone,
        title: formValue.title,
        password: formValue.password,
        password_confirm: formValue.password_confirm,
        role: formValue.role,
        permission: formValue.permission,
        status: formValue.status,
        signature: formValue.signature || '',
        entreprise: formValue.entreprise || 'OPTIMAT INCORPORATION'
      };

      this.authService.register(registerData).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.toastr.success(response.message, 'Inscription réussie');
          // Redirection vers la page de connexion
          this.router.navigate(['/auth/login']);
        },
        error: (error) => {
          this.isLoading = false;
          this.error = error.message || 'Erreur lors de la création du compte.';
          this.toastr.error(this.error || 'Erreur lors de la création du compte.', 'Erreur d\'inscription');
        }
      });
    } else {
      // Marquer tous les champs comme touchés pour afficher les erreurs
      Object.keys(this.registerForm.controls).forEach(key => {
        this.registerForm.get(key)?.markAsTouched();
      });
    }
  }
}
