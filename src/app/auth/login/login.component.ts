import { Component, OnInit } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  year: string;
  isLoading = false;
  canShowRegisterLink = false; // Désactivé pour le système simple
  
  // Form reactive
  loginForm: FormGroup;
  
  // Validation states pour affichage
  emailError: string = '';
  passwordError: string = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) {
    this.year = formatDate(new Date(), 'yyyy', 'en');
    
    // Initialisation du formulaire réactif
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    // Vérifier si l'utilisateur est déjà connecté
    if (this.authService.isAuthentification()) {
      this.router.navigate(['/admin']);
    }
  }

  // Méthode de validation des champs utilisant le formulaire réactif
  validateForm(): boolean {
    this.emailError = '';
    this.passwordError = '';

    const emailControl = this.loginForm.get('email');
    const passwordControl = this.loginForm.get('password');

    // Validation email
    if (emailControl?.hasError('required')) {
      this.emailError = 'L\'email est requis';
    } else if (emailControl?.hasError('email')) {
      this.emailError = 'Format d\'email invalide';
    }

    // Validation password
    if (passwordControl?.hasError('required')) {
      this.passwordError = 'Le mot de passe est requis';
    } else if (passwordControl?.hasError('minlength')) {
      this.passwordError = 'Le mot de passe doit contenir au moins 6 caractères';
    }

    return this.loginForm.valid;
  }

  // Clear error messages when user types
  onEmailChange(): void {
    this.emailError = '';
  }

  onPasswordChange(): void {
    this.passwordError = '';
  }

  onSubmit(event?: Event) {
    // Empêcher le comportement par défaut du formulaire
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    // Validation côté client
    if (!this.validateForm()) {
      return;
    }

    console.log("Tentative de connexion...");
    this.isLoading = true;
    
    const formValue = this.loginForm.value;
    const loginData = {
      email: formValue.email?.trim(),
      password: formValue.password
    };

    this.authService.login(loginData).subscribe({
      next: (response) => { 
        this.isLoading = false;
        
        if (response.success && response.user) {
          console.log('Connexion réussie:', response);
          this.toastr.success(`Bienvenue ${response.user.fullname}! 🎉`, 'Connexion réussie');
          
          // Redirection vers l'admin
          if (response.user.role === 'admin' || response.user.role === 'super-admin') {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/dashboard']);
          }
        } else {
          this.toastr.error(response.message, 'Erreur de connexion');
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Erreur de connexion:', error);
        this.toastr.error('Une erreur est survenue lors de la connexion', 'Erreur');
      }
    });
  }
}
