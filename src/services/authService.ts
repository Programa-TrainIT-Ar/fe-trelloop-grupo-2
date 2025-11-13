// Aquí irán las funciones para enviar las credenciales de login al backend, 
// recibir el token, y posiblemente manejar el cierre de sesión si requiere una llamada al servidor 
// Aquí es donde se definirá cómo se envía el email y la contraseña al backend y cómo se recibe la respuesta (el token)

import { AUTH_ENDPOINTS } from "constants/apiEndpoints";
import { ApiError, LoginRequest, LoginResponse } from "types/auth";
import { RegisterData } from "types/user";

export async function registerUserService(data: RegisterData ){
  const response = await fetch(AUTH_ENDPOINTS.REGISTER, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      password: data.password,
      confirm_password: data.confirmPassword,
    }),
  });

  const resData = await response.json();

  if (!response.ok) {
    //Lanza un error con el mensaje del backend si existe
    throw new Error(resData?.error || resData?.message || "Error al registrar usuario");
  }

  return resData;
};

export const authService = {
    async login(credentials: LoginRequest): Promise<LoginResponse> {
        try {
            const response = await fetch(AUTH_ENDPOINTS.lOGIN, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
            });

            if (!response.ok) {
                const errorData: ApiError = await response.json();
                throw new Error(errorData.message || 'Error al iniciar sesión');
            }

            const data: LoginResponse = await response.json();
            return data;
    
            } catch (error) {
                console.error('Error en el login:', error);
                throw error;
            
            }
        },
    async logout(): Promise<void> {
    }
    }


