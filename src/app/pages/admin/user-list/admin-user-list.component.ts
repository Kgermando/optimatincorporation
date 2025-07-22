import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { UserService, User } from '../../../services/user.service';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-admin-user-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-user-list.component.html',
  styleUrls: ['./admin-user-list.component.scss']
})
export class AdminUserListComponent implements OnInit {
  users: User[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.error = null;

    this.userService.getAllUsers().subscribe({
      next: (response) => {
        this.users = response.data;
        this.loading = false;
      },
      error: (error: any) => {
        this.error = 'Erreur lors du chargement des utilisateurs';
        this.loading = false;
        console.error('Error loading users:', error);
      }
    });
  }

  deleteUser(userId: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      this.userService.deleteUser(userId).subscribe({
        next: () => {
          this.loadUsers(); // Reload the list
        },
        error: (error: any) => {
          this.error = 'Erreur lors de la suppression de l\'utilisateur';
          console.error('Error deleting user:', error);
        }
      });
    }
  }

  toggleUserStatus(user: User): void {
    const updatedUser = { status: !user.status };
    
    this.userService.updateUser(user.ID!, updatedUser).subscribe({
      next: () => {
        this.loadUsers(); // Reload the list
      },
      error: (error: any) => {
        this.error = 'Erreur lors de la mise à jour du statut';
        console.error('Error updating user status:', error);
      }
    });
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
