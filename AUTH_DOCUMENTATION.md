# Module d'Authentification - Frontend Angular

## Vue d'ensemble

Ce module d'authentification a été mis à jour pour s'intégrer parfaitement avec votre backend Go/Fiber. Il comprend toutes les fonctionnalités nécessaires pour une authentification complète.

## Fonctionnalités implémentées

### 🔐 Authentification de base
- **Connexion** (`/auth/login`)
- **Inscription** (`/auth/register`) 
- **Déconnexion**

### 🔑 Gestion des mots de passe
- **Mot de passe oublié** (`/auth/forgot-password`)
- **Réinitialisation du mot de passe** (`/auth/reset/:token`)
- **Changement de mot de passe** (profil utilisateur)

### 🛡️ Sécurité
- **Gestion des tokens JWT**
- **Intercepteur HTTP automatique**
- **Garde d'authentification (AuthGuard)**
- **Gestion automatique des erreurs 401**

## Structure des fichiers

```
src/app/auth/
├── models/
│   └── user.model.ts              # Interfaces TypeScript alignées avec Go
├── login/
│   ├── login.component.ts
│   ├── login.component.html
│   └── login.component.scss
├── register/
│   ├── register.component.ts
│   ├── register.component.html
│   └── register.component.scss
├── forgot-password/
│   └── forgot-password.component.ts
├── reset-password/
│   └── reset-password.component.ts
├── auth.service.ts                # Service principal d'authentification
├── auth.guard.ts                  # Garde de protection des routes
├── auth.interceptor.ts            # Intercepteur JWT
├── auth.module.ts                 # Module Angular
├── auth-routing.module.ts         # Routes d'authentification
└── auth.component.ts              # Composant conteneur
```

## Configuration requise

### 1. Variables d'environnement

Assurez-vous que vos fichiers d'environnement sont configurés :

**src/environments/environment.development.ts**
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000/api', // URL de votre backend Go
};
```

**src/environments/environment.ts**
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://votre-api-production.com/api',
};
```

### 2. Configuration de l'intercepteur

L'intercepteur HTTP est déjà configuré dans `app.config.ts` pour :
- Ajouter automatiquement le token JWT aux requêtes
- Gérer les erreurs d'authentification (401)
- Rediriger vers la page de connexion si nécessaire

## Utilisation

### Service d'authentification

```typescript
import { AuthService } from './auth/auth.service';

constructor(private authService: AuthService) {}

// Connexion
this.authService.login({ email: 'user@example.com', password: 'password' })
  .subscribe({
    next: (response) => {
      console.log('Connecté:', response.data.user);
      // Token automatiquement sauvegardé
    },
    error: (error) => {
      console.error('Erreur:', error.message);
    }
  });

// Vérifier l'état de connexion
const isLoggedIn = this.authService.isAuthentication();

// Obtenir l'utilisateur actuel
const currentUser = this.authService.getCurrentUser();

// Observer les changements d'utilisateur
this.authService.currentUser$.subscribe(user => {
  console.log('Utilisateur actuel:', user);
});

// Déconnexion
this.authService.logout().subscribe();
```

### Protection des routes

```typescript
// Dans vos routes
{
  path: 'admin',
  loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
  canActivate: [AuthGuard]  // Protège toute la section admin
}
```

### Gestion des rôles

```typescript
// Vérifier le rôle de l'utilisateur
const user = this.authService.getCurrentUser();
if (user?.role === 'Admin') {
  // Utilisateur administrateur
}
```

## Endpoints backend correspondants

Le frontend communique avec ces endpoints de votre backend Go :

```
POST /api/auth/login
POST /api/auth/register
POST /api/auth/logout
POST /api/auth/forgot-password
POST /api/auth/reset/:token
GET  /api/auth/user?token=xxx
PUT  /api/auth/update-info?token=xxx
PUT  /api/auth/change-password?token=xxx
POST /api/auth/create-admin (développement)
```

## Format des données

### Connexion
```typescript
// Requête
{
  email: string;
  password: string;
}

// Réponse
{
  message: string;
  data: {
    token: string;
    user: UserModel;
  };
}
```

### Inscription
```typescript
// Requête
{
  fullname: string;
  email: string;
  phone: string;
  title: string;
  password: string;
  password_confirm: string;
  role: string;
  permission: string;
  status?: boolean;
  signature: string;
  entreprise: string;
}
```

### UserModel
```typescript
{
  id?: number;
  fullname: string;
  email: string;
  phone: string;
  title: string;
  role: string;           // 'Admin', 'User', etc.
  permission: string;     // 'ALL', 'CR', etc.
  status: boolean;
  signature: string;
  entreprise: string;
  created_at?: Date;
  updated_at?: Date;
}
```

## Gestion des erreurs

Le système gère automatiquement :
- **Erreurs de validation** : Affichage dans les formulaires
- **Erreurs réseau** : Messages toast avec ngx-toastr
- **Tokens expirés** : Redirection automatique vers login
- **Erreurs 401** : Nettoyage automatique du localStorage

## Fonctionnalités avancées

### Mise à jour des informations utilisateur

```typescript
this.authService.updateInfo({
  fullname: 'Nouveau nom',
  phone: '+243123456789'
}).subscribe({
  next: (response) => {
    console.log('Profil mis à jour:', response.data);
  }
});
```

### Changement de mot de passe

```typescript
this.authService.updatePassword({
  old_password: 'ancien_mdp',
  password: 'nouveau_mdp',
  password_confirm: 'nouveau_mdp'
}).subscribe({
  next: () => {
    console.log('Mot de passe changé');
  }
});
```

## Démarrage rapide

1. **Démarrer le backend Go** sur `localhost:8000`
2. **Démarrer le frontend Angular** : `npm start`
3. **Accéder à** `http://localhost:4200/auth/login`
4. **Créer un admin** (si nécessaire) via l'endpoint `/api/auth/create-admin`
5. **Se connecter** avec les identifiants admin

## Notes importantes

- Le token JWT est passé en paramètre de requête (`?token=xxx`) comme attendu par votre backend
- Le localStorage est utilisé pour la persistance des sessions
- Les mots de passe sont hashés côté backend (bcrypt)
- La validation des données suit les règles définies dans votre modèle Go

## Dépendances

- `@angular/common/http` - Requêtes HTTP
- `@angular/forms` - Formulaires réactifs  
- `ngx-toastr` - Notifications toast
- `@angular/router` - Navigation et guards

Cette implémentation est maintenant entièrement alignée avec votre backend Go/Fiber et prête pour la production.