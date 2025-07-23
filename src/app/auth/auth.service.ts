import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { UserModel } from './models/user.model';

interface LoginRequest {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly ADMIN_CREDENTIALS = [
    { email: 'admin@optimatincorporation.com', password: '@admin123', fullname: 'Administrateur', role: 'admin' },
    { email: 'support@optimatincorporation.com', password: '@supportadmin123', fullname: 'Super Administrateur', role: 'super-admin' }
  ];

  private currentUserSubject = new BehaviorSubject<UserModel | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    // Charger l'utilisateur depuis le localStorage au démarrage
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('currentUser');
      if (userData) {
        try {
          const user = JSON.parse(userData);
          this.currentUserSubject.next(user);
        } catch (error) {
          console.error('Erreur lors du chargement des données utilisateur:', error);
          localStorage.removeItem('currentUser');
        }
      }
    }
  }

  login(credentials: LoginRequest): Observable<{ success: boolean; message: string; user?: UserModel }> {
    const { email, password } = credentials;
    
    // Rechercher les identifiants dans la liste des admins
    const adminUser = this.ADMIN_CREDENTIALS.find(
      admin => admin.email === email && admin.password === password
    );

    if (adminUser) {
      const user: UserModel = {
        id: 1,
        fullname: adminUser.fullname,
        email: adminUser.email,
        phone: '',
        title: 'Administrateur',
        password: '',
        password_confirm: '',
        role: adminUser.role,
        permission: 'all',
        status: true,
        signature: '',
        entreprise: 'Optimat Incorporation'
      };

      // Sauvegarder dans le localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('isAuthenticated', 'true');
      }

      this.currentUserSubject.next(user);

      return of({ 
        success: true, 
        message: 'Connexion réussie', 
        user 
      });
    } else {
      return of({ 
        success: false, 
        message: 'Email ou mot de passe incorrect' 
      });
    }
  }

  register(data: any): Observable<any> {
    // Pour la compatibilité, mais non utilisé dans le système simple
    return of({ success: false, message: 'Inscription non disponible' });
  }

  user(): Observable<UserModel | null> {
    return of(this.currentUserSubject.value);
  }

  getCurrentUser(): UserModel | null {
    return this.currentUserSubject.value;
  }

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('isAuthenticated');
    }
    return null;
  }

  isAuthentification(): boolean {
    if (typeof window !== 'undefined') {
      const isAuth = localStorage.getItem('isAuthenticated');
      const userData = localStorage.getItem('currentUser');
      return isAuth === 'true' && !!userData;
    }
    return false;
  }

  logout(): Observable<void> {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('isAuthenticated');
    }
    this.currentUserSubject.next(null);
    return of(void 0);
  }

  updateInfo(data: any): Observable<UserModel> {
    // Pour la compatibilité
    const currentUser = this.currentUserSubject.value;
    if (currentUser) {
      const updatedUser = { ...currentUser, ...data };
      if (typeof window !== 'undefined') {
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      }
      this.currentUserSubject.next(updatedUser);
      return of(updatedUser);
    }
    throw new Error('Aucun utilisateur connecté');
  }

  updatePassword(data: any): Observable<UserModel> {
    // Pour la compatibilité
    const currentUser = this.currentUserSubject.value;
    if (currentUser) {
      return of(currentUser);
    }
    throw new Error('Aucun utilisateur connecté');
  }
}