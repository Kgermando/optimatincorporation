# Système d'Authentification Simple - Documentation

## Vue d'ensemble

Le système d'authentification a été simplifié pour utiliser le localStorage au lieu d'une API backend. Cette solution est idéale pour des applications de démonstration ou des projets qui n'ont pas besoin d'un backend complexe.

## Comptes Administrateurs Prédéfinis

### Compte Admin
- **Email:** `admin@admin.com`
- **Mot de passe:** `admin123`
- **Rôle:** `admin`

### Compte Super Admin
- **Email:** `superadmin@admin.com`
- **Mot de passe:** `superadmin123`
- **Rôle:** `super-admin`

## Fonctionnalités

### Service d'Authentification (`auth.service.ts`)
- Authentification locale avec identifiants prédéfinis
- Stockage des informations utilisateur dans localStorage
- Gestion de l'état de connexion avec BehaviorSubject
- Méthodes compatibles avec l'ancien système API

### Guard d'Authentification (`auth.guard.ts`)
- Vérification simple basée sur localStorage
- Redirection automatique vers les pages de connexion appropriées
- Protection des routes admin et utilisateur

### Service Utilisateur (`user.service.ts`)
- Données utilisateur en dur (mock data)
- Interface compatible avec l'ancien système
- Gestion CRUD simulée en mémoire

## Modifications Apportées

### Fichiers Modifiés
1. **`auth.service.ts`** - Système simple avec localStorage
2. **`login.component.ts`** - Suppression des appels API
3. **`auth.guard.ts`** - Logique simplifiée
4. **`user.service.ts`** - Données en dur
5. **`app.config.ts`** - Suppression des interceptors

### Fichiers Supprimés
1. **`auth/interceptors/credential.interceptor.ts`**
2. **`interceptors/auth.interceptor.ts`**
3. **Dossier `interceptors/`** complet

## Avantages

✅ **Simplicité** - Pas besoin de backend  
✅ **Rapidité** - Authentification instantanée  
✅ **Démonstration** - Parfait pour les prototypes  
✅ **Maintenance** - Code plus simple à maintenir  

## Limitations

⚠️ **Sécurité** - Pas de vérification serveur  
⚠️ **Persistance** - Données perdues au refresh  
⚠️ **Scalabilité** - Non adapté pour la production  

## Comment Utiliser

1. **Connexion** : Utilisez l'un des comptes prédéfinis
2. **Navigation** : L'accès aux routes protégées fonctionne normalement
3. **Déconnexion** : Utilise la méthode logout() standard

## Restaurer le Système API (si nécessaire)

Pour revenir au système avec API :
1. Restaurer les fichiers interceptors depuis le git
2. Remettre les appels HTTP dans auth.service.ts
3. Restaurer la configuration des interceptors dans app.config.ts
4. Remettre les appels API dans user.service.ts

## Structure du LocalStorage

```javascript
// Clés utilisées
localStorage.setItem('currentUser', JSON.stringify(userObject));
localStorage.setItem('isAuthenticated', 'true');
```

## Exemple d'Utilisation

```typescript
// Vérifier si connecté
if (this.authService.isAuthentification()) {
  // Utilisateur connecté
}

// Obtenir l'utilisateur actuel
this.authService.user().subscribe(user => {
  console.log(user);
});

// Se déconnecter
this.authService.logout().subscribe(() => {
  // Déconnexion réussie
});
```
