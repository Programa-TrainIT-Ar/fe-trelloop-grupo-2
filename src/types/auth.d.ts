// Interfaz para las solicitudes de login 
// las respuestas de la API de autenticación (que contienen el token)
//  y los datos del usuario autenticado.

// definir los tipos en auth.d.ts (parte que se recibe del login)

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string; 
    name: string;
    email: string;
    id: number;
    createdAt: string;
}

export interface ApiError {
    message: string;
    statusCode: number;
}