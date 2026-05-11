import { Component, signal, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

interface AdminNavItem {
  label: string;
  path: string;
  icon: string;
}

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss'
})
export class AdminLayoutComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  sidebarOpen = signal(true);
  user = this.authService.currentUser;

  navItems: AdminNavItem[] = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: 'dashboard' },
    { label: 'Portfolio', path: '/admin/portfolio', icon: 'portfolio' },
    { label: 'Services', path: '/admin/services', icon: 'services' },
    { label: 'Blog', path: '/admin/blog', icon: 'blog' },
    { label: 'Équipe', path: '/admin/team', icon: 'team' },
    { label: 'Messages', path: '/admin/contacts', icon: 'contacts' },
    { label: 'Utilisateurs', path: '/admin/users', icon: 'users' },
  ];

  logout(): void {
    this.authService.logout();
  }
}
