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

export const routes: Routes = [
    {
        path: '', redirectTo: '/acceuil', pathMatch: 'full'
    },
    {
        path: 'acceuil', component: HomeComponent,
        data: {
            title: 'Acceuil',
            metatags: {
                description: 'Acceuil de notre site',
                keywords: 'acceuil, home, site',
                robots: 'index, follow'
            }
        }
    },
    {
        path: 'about', component: AboutComponent,
        data: {
            title: 'A propos',
            metatags: {
                description: 'A propos de notre site',
                keywords: 'a propos, about, site',
                robots: 'index, follow'
            }
        },
    },
    {
        path: 'contact', component: ContactComponent,
        data: {
            title: 'Contact',
            metatags: {
                description: 'Contactez nous',
                keywords: 'contact, site',
                robots: 'index, follow'
            }
        },
    },
    {
        path: 'cart', component: CartComponent,
        data: {
            title: 'Panier',
            metatags: {
                description: 'Votre panier',
                keywords: 'panier, cart',
                robots: 'index, follow'
            }
        },
    },
    {
        path: 'checkout', component: CheckoutComponent,
        data: {
            title: 'Commandes',
            metatags: {
                description: 'Commandes',
                keywords: 'commander, checkout',
                robots: 'index, follow'
            }
        },
    },
    {
        path: 'services', component: ServicesPageComponent,
        data: {
            title: 'Services',
            metatags: {
                description: 'Liste des services',
                keywords: 'services, services',
                robots: 'index, follow'
            }
        },
    },
    {
        path: 'service-details', component: ServiceDetailComponent,
        data: {
            title: 'Détail du service',
            metatags: {
                description: 'Détail du service',
                keywords: 'detail, service',
                robots: 'index, follow'
            }
        },
    },
    {
        path: 'products', component: ProductsComponent,
        data: {
            title: 'Produits',
            metatags: {
                description: 'Liste des produits',
                keywords: 'produits, products',
                robots: 'index, follow'
            }
        },
    },
    {
        path: 'products/:title/detail', component: ProductDetailComponent,
        data: {
            title: 'Détail du produit',
            metatags: {
                description: 'Détail du produit',
                keywords: 'detail, produit',
                robots: 'index, follow'
            }
        },
    },
    { path: 'blog', component: BlogComponent,
        data: {
            title: 'Blog',
            metatags: {
                description: 'Liste des articles',
                keywords: 'blog, articles',
                robots: 'index, follow'
            }
        },
     },
    { path: 'blog-details', component: BlogDetailComponent,
        data: {
            title: 'Détail de l\'article',
            metatags: {
                description: 'Détail de l\'article',
                keywords: 'detail, article',
                robots: 'index, follow'
            }
        },
     },

    
    {
        path: '**', component: ErrorComponent,
        data: {
            title: 'Erreur 404',
            metatags: {
                description: 'Page introuvable',
                keywords: 'erreur, 404, page',
                robots: 'noindex, nofollow'
            }
        },
    },
];
