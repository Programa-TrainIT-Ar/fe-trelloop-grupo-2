import { create } from 'zustand';
import { authController } from '../controllers/authController';
import { LoginRequest } from '../types/auth';
import { UserProfile } from '../types/user';

// Tipos para las razones de logout
export type LogoutReason = 'manual' | 'inactivity' | 'session_expired';

interface AuthState {
  user: UserProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
  logoutReason: LogoutReason | null;
  login: (credentials: LoginRequest) => Promise<boolean>;
  logout: (reason?: LogoutReason) => Promise<void>;
  hydrate: () => void;
  clearLogoutReason: () => void; // Para limpiar el motivo
  // funciones para auto-logout
  startInactivityTimer: () => void;
  stopInactivityTimer: () => void;
  resetInactivityTimer: () => void;
}

//Variables globales para el temporizador 
let inactivityTimer: NodeJS.Timeout | null = null;
const INACTIVITY_TIME = 60 * 60 * 1000; // 60 minutos en milisegundos

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: true, //al cargar por primera vez
  isAuthenticated: false,
  logoutReason: null, // Inicialmente null

  //LOGIN
  login: async (credentials: LoginRequest) => {
    set({ loading: true });
    const result = await authController.handleLogin(credentials);
    if (result.success && result.email) {
      set({ user: result.email, isAuthenticated: true, loading: false, logoutReason: null });
      get().startInactivityTimer(); // Iniciar el temporizador de inactividad
      return true;
    }
    set({ loading: false });
    return false;
  },

  //LOGOUT
  logout: async (reason: LogoutReason = 'manual') => {
    set({ loading: true });
    await authController.handleLogout();
    set({ user: null, isAuthenticated: false, loading: false, logoutReason: reason });
    get().stopInactivityTimer(); // Detener el temporizador de inactividad
  },

  // LIMPIAR razón de logout
  clearLogoutReason: () => {
    set({ logoutReason: null });
  },
  
  //HIDRATAR estado al iniciar la app
  hydrate: () => {
    const token = authController.token;
    const userInfo = authController.userInfo;

    if (token && userInfo) {
      set({
        user: userInfo,
        isAuthenticated: true,
        loading: false
      });
      get().startInactivityTimer(); // Iniciar el temporizador después de hidratar si está autenticado
    } else {
      set({ loading: false });
    }
  },

// INICIAR temporizador de inactividad
  startInactivityTimer: () => {
  // Primero limpiamos cualquier temporizador existente
  get().stopInactivityTimer();

  // Solo iniciamos el temporizador si estamos en el cliente
  if (typeof window !== 'undefined') {
    inactivityTimer = setTimeout(() => {
      console.log('Sesión cerrada por inactividad');
      get().logout();
    }, INACTIVITY_TIME);
  }
},

  // DETENER temporizador de inactividad
  stopInactivityTimer: () => {
    if (inactivityTimer) {
      clearTimeout(inactivityTimer);
      inactivityTimer = null;
    }
  },

  // REINICIAR temporizador (cuando hay actividad)
  resetInactivityTimer: () => {
    const { isAuthenticated } = get();
    if (isAuthenticated) {
      get().startInactivityTimer();
    }
  },  
}));

export const getToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("auth_token");
  }
  return null;
};