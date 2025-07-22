import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { UserService, User, CreateUserRequest, UpdateUserRequest } from '../../../services/user.service';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-admin-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './admin-user-form.component.html',
  styleUrls: ['./admin-user-form.component.scss']
})
export class AdminUserFormComponent implements OnInit {
  userForm: FormGroup;
  loading = false;
  error: string | null = null;
  isEditMode = false;
  userId: number | null = null;

  roles = [
    { value: 'Admin', label: 'Administrateur' },
    { value: 'User', label: 'Utilisateur' },
    { value: 'Editor', label: 'Éditeur' },
    { value: 'Moderator', label: 'Modérateur' }
  ];

  permissions = [
    { value: 'CR', label: 'Créer/Lire' },
    { value: 'CRU', label: 'Créer/Lire/Modifier' },
    { value: 'CRUD', label: 'Accès complet' },
    { value: 'R', label: 'Lecture seule' }
  ];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.userForm = this.fb.group({
      fullname: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      title: [''],
      password: ['', [Validators.minLength(6)]],
      password_confirm: [''],
      role: ['User', Validators.required],
      permission: ['CR', Validators.required],
      status: [true],
      entreprise: ['OPTIMAT INCORPORATION'],
      signature: ['']
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.userId = +params['id'];
        this.loadUser(this.userId);
        // En mode édition, le mot de passe n'est pas requis
        this.userForm.get('password')?.clearValidators();
        this.userForm.get('password')?.updateValueAndValidity();
      } else {
        // En mode création, le mot de passe est requis
        this.userForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
        this.userForm.get('password')?.updateValueAndValidity();
      }
    });
  }

  passwordMatchValidator(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('password_confirm')?.value;
    
    if (password && confirmPassword && password !== confirmPassword) {
      return { passwordMismatch: true };
    }
    return null;
  }

  loadUser(id: number): void {
    this.loading = true;
    this.userService.getUserById(id).subscribe({
      next: (response) => {
        const user = response.data;
        this.userForm.patchValue({
          fullname: user.fullname,
          email: user.email,
          phone: user.phone,
          title: user.title,
          role: user.role,
          permission: user.permission,
          status: user.status,
          entreprise: user.entreprise,
          signature: user.signature
        });
        this.loading = false;
      },
      error: (error: any) => {
        this.error = 'Erreur lors du chargement de l\'utilisateur';
        this.loading = false;
        console.error('Error loading user:', error);
      }
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.userForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      this.loading = true;
      this.error = null;

      const formData = { ...this.userForm.value };
      
      // Si le mot de passe est vide en mode édition, on ne l'envoie pas
      if (this.isEditMode && !formData.password) {
        delete formData.password;
        delete formData.password_confirm;
      }

      const request = this.isEditMode 
        ? this.userService.updateUser(this.userId!, formData)
        : this.userService.createUser(formData);

      request.subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/admin/users']);
        },
        error: (error: any) => {
          this.loading = false;
          this.error = error.error?.message || 'Erreur lors de la sauvegarde';
          console.error('Error saving user:', error);
        }
      });
    }
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/auth/login']);
      },
      error: (error: any) => {
        console.error('Logout error:', error);
        // Même en cas d'erreur, on redirige vers la page de connexion
        this.router.navigate(['/auth/login']);
      }
    });
  }
}
