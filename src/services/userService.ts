import { USERS_ENDPOINTS } from "constants/apiEndpoints";
import { authController } from "../controllers/authController";



export async function searchUsersService(query: string) {
    const token = authController.token;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  
    if (!apiUrl) {
      console.warn("No se ha definido NEXT_PUBLIC_API_URL");
      return [];
    }

  const response = await fetch(
    `${USERS_ENDPOINTS.SEARCH}?q=${encodeURIComponent(query)}`,
    // USERS_ENDPOINTS.SEARCH,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, 
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || "Error al buscar usuarios");
  }

  return data;
}
