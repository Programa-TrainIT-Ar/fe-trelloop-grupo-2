
import { authService, registerUserService } from "services/authService";
import { RegisterData } from "../types/user";
import { ValidationError } from '../types/validatesError';
import { UserProfile } from "../types/user";
import { LoginRequest, LoginResponse } from "types/auth";


export async function registerUserController(data: RegisterData) {
  const { firstName, lastName, email, password, confirmPassword } = data;

  // Campos obligatorios
  if (!firstName || !lastName || !email || !password || !confirmPassword) {
    throw new ValidationError("Todos los campos son obligatorios.", "general"); 
  }

  // Validación de longitud de nombres
  if (firstName.trim().length < 3) {
    throw new ValidationError("El nombre debe tener al menos 3 caracteres.", "firstName");
  }

  if (lastName.trim().length < 3) {
    throw new ValidationError("El apellido debe tener al menos 3 caracteres.", "lastName");
  }

  // Validación de email
  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!emailRegex.test(email)) {
    throw new ValidationError("Correo electrónico inválido.", "email");
  }

  // Validación de contraseñas
  if (password !== confirmPassword) {
    throw new ValidationError("Las contraseñas no coinciden.", "confirmPassword"); 
  }

  if (password.length < 8) {
    throw new ValidationError("La contraseña debe tener al menos 8 caracteres.", "password");
  }

  if (!/[A-Z]/.test(password)) {
    throw new ValidationError("La contraseña debe contener al menos una letra mayúscula.", "password");
  }

  if (!/[0-9]/.test(password)) {
    throw new ValidationError("La contraseña debe contener al menos un número.", "password");
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    throw new ValidationError("La contraseña debe contener al menos un carácter especial.", "password");
  }

  return await registerUserService(data);
}



const TOKEN_KEY = 'auth_token'; // Clave para localStorage
const USER_INFO_KEY = 'user_info'; // Clave para información del usuario

 export const authController = {
     async handleLogin(credentials: LoginRequest): 
     Promise<{ success: boolean; message?: string; email?: UserProfile}> {
     try {
        const response: LoginResponse = await authService.login(credentials);
        // Guardar el token en localStorage
        localStorage.setItem(TOKEN_KEY, response.token);
        // Guardar la información del usuario en localStorage
        localStorage.setItem(USER_INFO_KEY, JSON.stringify({ email: credentials.email, id: response.id }));
        // Construir un UserProfile básico
        const userProfile: UserProfile = { 
            email: credentials.email, 
            id: response.id, 
            name: response.name || '', 
            createdAt: response.createdAt || new Date().toISOString() 
        };
        return { success: true, email: userProfile };
     } catch (error: any) {
     return { success: false, message: error.message || 'Credenciales inválidas' };
    }
}, 
 async handleLogout(): Promise<void> {
     try {
         await authService.logout(); 
         // Eliminar el token y la información del usuario de localStorage
         localStorage.removeItem(TOKEN_KEY);
         localStorage.removeItem(USER_INFO_KEY);
     } catch (error) {
        console.error('Error al cerrar sesión:', error);
     }
    },

    get token(): string | null {
        return localStorage.getItem(TOKEN_KEY);
    }, 
    get userInfo(): UserProfile | null {
        const userInfo = localStorage.getItem(USER_INFO_KEY);
        return userInfo ? JSON.parse(userInfo) : null;
    },

    isAuthenticated(): boolean {
        return !!localStorage.getItem(TOKEN_KEY);
    }, 
}
