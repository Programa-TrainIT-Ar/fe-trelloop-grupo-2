import axios from "axios";
import { authController } from "../controllers/authController";

export const getUserBoards = async () => {
  const token = authController.token;

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    console.warn("No se ha definido NEXT_PUBLIC_API_URL");
    return [];
  }

  try {
    const response = await axios.get(`${apiUrl}/api/boards/member`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error al obtener tableros del backend:", error);
    return []; // Devuelve vacío para fallback a mockBoards
  }
};