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
import { AdminLoginComponent } from './pages/admin/login/admin-login.component';
import { AdminDashboardComponent } from './pages/admin/dashboard/admin-dashboard.component';
import { AdminBlogListComponent } from './pages/admin/blog-list/admin-blog-list.component';
import { AdminBlogFormComponent } from './pages/admin/blog-form/admin-blog-form.component';
import { AuthGuard } from './pages/admin/auth.guard';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'about', component: AboutComponent },
    { path: 'contact', component: ContactComponent },
    { path: 'error', component: ErrorComponent },
    { path: 'cart', component: CartComponent },
    { path: 'checkout', component: CheckoutComponent },
    { path: 'products/:id', component: ProductDetailComponent },
    { path: 'services', component: ServicesPageComponent },
    { path: 'services/:id', component: ServiceDetailComponent },
    { path: 'products', component: ProductsComponent },
    { path: 'blog', component: BlogComponent },
    { path: 'blog/:id', component: BlogDetailComponent },
    // Admin routes
    {
        path: 'admin/login', 
        component: AdminLoginComponent,
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
        path: 'admin/blogs/:id/edit', 
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
        path: 'admin', 
        redirectTo: '/admin/dashboard', 
        pathMatch: 'full'
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
        path: 'admin/blogs/:id/edit', 
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
    { path: '**', redirectTo: '/error' }
];