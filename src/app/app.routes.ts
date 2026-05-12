import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Public layout
  {
    path: '',
    loadComponent: () => import('./layout/public-layout.component').then(m => m.PublicLayoutComponent),
    children: [
      { path: '', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent), title: 'OPTIMAT Incorporation — Studio d\'Animation 3D en RDC' },
      { path: 'about', loadComponent: () => import('./pages/about/about.component').then(m => m.AboutComponent), title: 'À Propos — OPTIMAT Incorporation' },
      { path: 'services', loadComponent: () => import('./pages/services/services.component').then(m => m.ServicesComponent), title: 'Services — OPTIMAT Incorporation' },
      { path: 'realisations', loadComponent: () => import('./pages/realisations/realisations.component').then(m => m.RealisationsComponent), title: 'Réalisations — OPTIMAT Incorporation' },
      { path: 'realisations/:slug', loadComponent: () => import('./pages/realisations/realisation-detail/realisation-detail.component').then(m => m.RealisationDetailComponent) },
      { path: 'team', loadComponent: () => import('./pages/team/team.component').then(m => m.TeamComponent), title: 'Notre Équipe — OPTIMAT Incorporation' },
      { path: 'blog', loadComponent: () => import('./pages/blog/blog.component').then(m => m.BlogComponent), title: 'Blog — OPTIMAT Incorporation' },
      { path: 'blog/:slug', loadComponent: () => import('./pages/blog/blog-detail/blog-detail.component').then(m => m.BlogDetailComponent) },
      { path: 'contact', loadComponent: () => import('./pages/contact/contact.component').then(m => m.ContactComponent), title: 'Contact — OPTIMAT Incorporation' },
    ]
  },

  // Admin login (no layout)
  {
    path: 'admin/login',
    loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent),
    title: 'Connexion Admin — OPTIMAT'
  },

  // Admin layout (protected)
  {
    path: 'admin',
    canActivate: [authGuard],
    loadComponent: () => import('./admin/layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./admin/dashboard/dashboard.component').then(m => m.DashboardComponent), title: 'Dashboard — Admin' },
      { path: 'portfolio', loadComponent: () => import('./admin/portfolio/portfolio-list.component').then(m => m.PortfolioListComponent), title: 'Portfolio — Admin' },
      { path: 'portfolio/new', loadComponent: () => import('./admin/portfolio/portfolio-form.component').then(m => m.PortfolioFormComponent) },
      { path: 'portfolio/:id/edit', loadComponent: () => import('./admin/portfolio/portfolio-form.component').then(m => m.PortfolioFormComponent) },
      { path: 'services', loadComponent: () => import('./admin/services/services-list.component').then(m => m.ServicesListComponent), title: 'Services — Admin' },
      { path: 'services/new', loadComponent: () => import('./admin/services/service-form.component').then(m => m.ServiceFormComponent) },
      { path: 'services/:id/edit', loadComponent: () => import('./admin/services/service-form.component').then(m => m.ServiceFormComponent) },
      { path: 'blog', loadComponent: () => import('./admin/blog/blog-list.component').then(m => m.BlogListComponent), title: 'Blog — Admin' },
      { path: 'blog/new', loadComponent: () => import('./admin/blog/blog-form.component').then(m => m.BlogFormComponent) },
      { path: 'blog/:id/edit', loadComponent: () => import('./admin/blog/blog-form.component').then(m => m.BlogFormComponent) },
      { path: 'team', loadComponent: () => import('./admin/team/team-list.component').then(m => m.TeamListComponent), title: 'Équipe — Admin' },
      { path: 'team/new', loadComponent: () => import('./admin/team/team-form.component').then(m => m.TeamFormComponent) },
      { path: 'team/:id/edit', loadComponent: () => import('./admin/team/team-form.component').then(m => m.TeamFormComponent) },
      { path: 'contacts', loadComponent: () => import('./admin/contacts/contacts.component').then(m => m.ContactsComponent), title: 'Messages — Admin' },
      { path: 'users', loadComponent: () => import('./admin/users/users-list.component').then(m => m.UsersListComponent), title: 'Utilisateurs — Admin' },
      { path: 'users/new', loadComponent: () => import('./admin/users/user-form.component').then(m => m.UserFormComponent) },
      { path: 'users/:id/edit', loadComponent: () => import('./admin/users/user-form.component').then(m => m.UserFormComponent) },
    ]
  },

  { path: '**', loadComponent: () => import('./pages/not-found/not-found.component').then(m => m.NotFoundComponent) }
];

