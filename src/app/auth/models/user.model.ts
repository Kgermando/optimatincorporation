export interface UserModel {
    id?: number;
    fullname: string;
    email: string;
    phone: string;
    title: string;
    password?: string;
    password_confirm?: string;
    role: string;
    permission: string;
    status: boolean;
    signature: string;
    entreprise: string;
    created_at?: Date;
    updated_at?: Date;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    message: string;
    data: {
        token: string;
        user: UserModel;
    };
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
    status?: boolean;
    signature: string;
    entreprise: string;
}

export interface RegisterResponse {
    message: string;
    data: UserModel;
}

export interface UpdateInfoRequest {
    fullname?: string;
    phone?: string;
    title?: string;
    entreprise?: string;
    signature?: string;
    role?: string;
    permission?: string;
    status?: boolean;
}

export interface UpdateInfoResponse {
    message: string;
    data: UserModel;
}

export interface ChangePasswordRequest {
    old_password: string;
    password: string;
    password_confirm: string;
}

export interface ChangePasswordResponse {
    message: string;
}

export interface ForgotPasswordRequest {
    email: string;
}

export interface ResetPasswordRequest {
    password: string;
    password_confirm: string;
}

export interface AuthState {
    isAuthenticated: boolean;
    user: UserModel | null;
    token: string | null;
}

export interface ApiError {
    message: string;
    error?: string;
}
