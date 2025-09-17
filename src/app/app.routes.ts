import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';
import { ErrorComponent } from './pages/error/error.component';
import { CartComponent } from './pages/cart/cart.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { ProductDetailComponent } from './pages/products/product-detail/product-detail.component';
import { ServicesPageComponent } from './pages/services-page/services-page.component';
import { ServiceDetailComponent } from './pages/services-page/service-detail/service-detail.component';
import { ProductsComponent } from './pages/products/products.component';
import { BlogComponent } from './pages/blog/blog.component';
import { BlogDetailComponent } from './pages/blog/blog-detail/blog-detail.component';
import { AdminDashboardComponent } from './pages/admin/dashboard/admin-dashboard.component';
import { AdminBlogListComponent } from './pages/admin/blog-list/admin-blog-list.component';
import { AdminBlogFormComponent } from './pages/admin/blog-form/admin-blog-form.component';
import { AdminUserListComponent } from './pages/admin/user-list/admin-user-list.component';
import { AdminUserFormComponent } from './pages/admin/user-form/admin-user-form.component';
import { AuthGuard } from './auth/auth.guard';
import { AuthComponent } from './auth/auth.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'about', component: AboutComponent },
    { path: 'contact', component: ContactComponent },
    { path: 'error', component: ErrorComponent },
    { path: 'cart', component: CartComponent },
    { path: 'checkout', component: CheckoutComponent },
    { path: 'products/:title_url', component: ProductDetailComponent },
    { path: 'services', component: ServicesPageComponent },
    { path: 'services/:title_url', component: ServiceDetailComponent },
    { path: 'products', component: ProductsComponent },
    { path: 'blog', component: BlogComponent },
    { path: 'blog-details/:title_url', component: BlogDetailComponent },
    // Auth routes
    {
        path: 'auth', 
        component: AuthComponent,
        children: [
            { path: 'login', component: LoginComponent },
            { path: 'register', component: RegisterComponent },
            { path: '', redirectTo: 'login', pathMatch: 'full' }
        ]
    },
    
    // Admin routes
    {
        path: 'admin/login', 
        component: LoginComponent,
        data: {
            title: 'Connexion Admin',
            metatags: {
                description: 'Connexion administration',
                keywords: 'admin, connexion',
                robots: 'noindex, nofollow'
            }
        }
    },
    {
        path: 'admin/register', 
        component: RegisterComponent,
        data: {
            title: 'Inscription Admin',
            metatags: {
                description: 'Inscription administration',
                keywords: 'admin, inscription',
                robots: 'noindex, nofollow'
            }
        }
    },
    {
        path: 'admin/dashboard', 
        component: AdminDashboardComponent,
        canActivate: [AuthGuard],
        data: {
            title: 'Tableau de bord Admin',
            metatags: {
                description: 'Tableau de bord administration',
                keywords: 'admin, dashboard',
                robots: 'noindex, nofollow'
            }
        }
    },
    {
        path: 'admin/blogs', 
        component: AdminBlogListComponent,
        canActivate: [AuthGuard],
        data: {
            title: 'Gestion des blogs',
            metatags: {
                description: 'Gestion des articles de blog',
                keywords: 'admin, blog, gestion',
                robots: 'noindex, nofollow'
            }
        }
    },
    {
        path: 'admin/blogs/create', 
        component: AdminBlogFormComponent,
        canActivate: [AuthGuard],
        data: {
            title: 'Créer un article',
            metatags: {
                description: 'Créer un nouvel article de blog',
                keywords: 'admin, blog, créer',
                robots: 'noindex, nofollow'
            }
        }
    },
    {
        path: 'admin/blogs/:title_url/edit', 
        component: AdminBlogFormComponent,
        canActivate: [AuthGuard],
        data: {
            title: 'Modifier un article',
            metatags: {
                description: 'Modifier un article de blog',
                keywords: 'admin, blog, modifier',
                robots: 'noindex, nofollow'
            }
        }
    },
    {
        path: 'admin/users', 
        component: AdminUserListComponent,
        canActivate: [AuthGuard],
        data: {
            title: 'Gestion des utilisateurs',
            metatags: {
                description: 'Gestion des utilisateurs',
                keywords: 'admin, utilisateurs, gestion',
                robots: 'noindex, nofollow'
            }
        }
    },
    {
        path: 'admin/users/create', 
        component: AdminUserFormComponent,
        canActivate: [AuthGuard],
        data: {
            title: 'Créer un utilisateur',
            metatags: {
                description: 'Créer un nouvel utilisateur',
                keywords: 'admin, utilisateur, créer',
                robots: 'noindex, nofollow'
            }
        }
    },
    {
        path: 'admin/users/:title_url/edit', 
        component: AdminUserFormComponent,
        canActivate: [AuthGuard],
        data: {
            title: 'Modifier un utilisateur',
            metatags: {
                description: 'Modifier un utilisateur',
                keywords: 'admin, utilisateur, modifier',
                robots: 'noindex, nofollow'
            }
        }
    },
    {
        path: 'admin', 
        redirectTo: '/admin/dashboard', 
        pathMatch: 'full'
    },
    { path: '**', redirectTo: '/error' }
];