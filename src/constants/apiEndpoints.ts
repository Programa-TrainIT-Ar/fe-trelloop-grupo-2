// Aquí se definen las URLs del API de autenticación

export const API_BASE_URL =  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const AUTH_ENDPOINTS = {
    lOGIN: `${API_BASE_URL}/api/users/login`,
    REGISTER: `${API_BASE_URL}/api/register`
    //LOGOUT: `${API_BASE_URL}/logout`,
    //REFRESH_TOKEN: `${API_BASE_URL}/refresh`,
}