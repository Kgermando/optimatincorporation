import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

// Backend User Model Structure (based on Go Fiber API)
export interface User {
  ID?: number;
  fullname: string;
  email: string;
  phone?: string;
  title?: string;
  role?: string;
  permission?: string;
  status?: boolean;
  signature?: string;
  entreprise?: string;
  created_at?: string;
  updated_at?: string;
}

// Response structure from backend
export interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  status: string;
  message: string;
  data: T[];
  pagination: {
    total_pages: number;
    page: number;
    page_size: number;
    length: number;
  };
}

// Request structures
export interface CreateUserRequest {
  fullname: string;
  email: string;
  phone?: string;
  title?: string;
  role?: string;
  permission?: string;
  status?: boolean;
  entreprise?: string;
  signature?: string;
  password: string;
  password_confirm: string;
}

export interface UpdateUserRequest {
  fullname?: string;
  email?: string;
  phone?: string;
  title?: string;
  role?: string;
  permission?: string;
  status?: boolean;
  entreprise?: string;
  signature?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // Données en dur pour le système simple
  private mockUsers: User[] = [
    {
      ID: 1,
      fullname: 'Administrateur',
      email: 'admin@admin.com',
      phone: '+1234567890',
      title: 'Administrateur Système',
      role: 'admin',
      permission: 'all',
      status: true,
      signature: 'Admin',
      entreprise: 'Optimat Incorporation',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      ID: 2,
      fullname: 'Super Administrateur',
      email: 'superadmin@admin.com',
      phone: '+1234567891',
      title: 'Super Administrateur',
      role: 'super-admin',
      permission: 'all',
      status: true,
      signature: 'SuperAdmin',
      entreprise: 'Optimat Incorporation',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  constructor() {}

  // Get all users with pagination
  getPaginatedUsers(page: number = 1, pageSize: number = 15): Observable<PaginatedResponse<User>> {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedUsers = this.mockUsers.slice(startIndex, endIndex);
    
    return of({
      status: 'success',
      message: 'Users retrieved successfully',
      data: paginatedUsers,
      pagination: {
        total_pages: Math.ceil(this.mockUsers.length / pageSize),
        page: page,
        page_size: pageSize,
        length: this.mockUsers.length
      }
    });
  }

  // Get all users without pagination
  getAllUsers(): Observable<ApiResponse<User[]>> {
    return of({
      status: 'success',
      message: 'Users retrieved successfully',
      data: this.mockUsers
    });
  }

  // Get user by ID
  getUserById(id: number): Observable<ApiResponse<User>> {
    const user = this.mockUsers.find(u => u.ID === id);
    if (user) {
      return of({
        status: 'success',
        message: 'User retrieved successfully',
        data: user
      });
    } else {
      return of({
        status: 'error',
        message: 'User not found',
        data: {} as User
      });
    }
  }

  // Create new user
  createUser(userData: CreateUserRequest): Observable<ApiResponse<User>> {
    const newUser: User = {
      ID: this.mockUsers.length + 1,
      ...userData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    this.mockUsers.push(newUser);
    
    return of({
      status: 'success',
      message: 'User created successfully',
      data: newUser
    });
  }

  // Update user
  updateUser(id: number, userData: UpdateUserRequest): Observable<ApiResponse<User>> {
    const userIndex = this.mockUsers.findIndex(u => u.ID === id);
    if (userIndex !== -1) {
      this.mockUsers[userIndex] = {
        ...this.mockUsers[userIndex],
        ...userData,
        updated_at: new Date().toISOString()
      };
      
      return of({
        status: 'success',
        message: 'User updated successfully',
        data: this.mockUsers[userIndex]
      });
    } else {
      return of({
        status: 'error',
        message: 'User not found',
        data: {} as User
      });
    }
  }

  // Delete user
  deleteUser(id: number): Observable<ApiResponse<null>> {
    const userIndex = this.mockUsers.findIndex(u => u.ID === id);
    if (userIndex !== -1) {
      this.mockUsers.splice(userIndex, 1);
      return of({
        status: 'success',
        message: 'User deleted successfully',
        data: null
      });
    } else {
      return of({
        status: 'error',
        message: 'User not found',
        data: null
      });
    }
  }
}
