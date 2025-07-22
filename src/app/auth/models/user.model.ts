export interface UserModel {
    id?: number;
    fullname: string;
    email: string;
    phone: string;
    title: string;
    password: string;
    password_confirm: string;
    role: string;
    permission: string;
    status: boolean;
    signature: string;
    entreprise?: string;
    created_at?: Date;
    updated_at?: Date;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    message: string;
    token: string;
}

export interface RegisterRequest {
    fullname: string;
    email: string;
    phone: string;
    title: string;
    password: string;
    password_confirm: string;
    role: string;
    permission: string;
    status: boolean;
    signature: string;
    entreprise: string;
}

export interface AuthState {
    isAuthenticated: boolean;
    user: UserModel | null;
    token: string | null;
}
