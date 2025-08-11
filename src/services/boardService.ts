import { authController } from "../controllers/authController";
import { ValidationError } from "../types/validatesError";


import { getToken } from "../store/authStore";

export const getUserBoards = async () => {
  const token = authController.token;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    console.warn("No se ha definido NEXT_PUBLIC_API_URL");
    return [];
  }

  try {
    const response = await fetch(`${apiUrl}/api/boards/member`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();
    return data.boards;
  } catch (error) {
    console.error("Error al obtener tableros del backend:", error);
    return [];
  }
};

export const createBoardService = async (data: FormData): Promise<void> => {
  const token = authController.token;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!token) {
    throw new ValidationError("No hay token de autenticación.", "general");
  }

  if (!apiUrl) {
    throw new ValidationError("No se ha definido la URL de la API.", "general");
  }

  const response = await fetch(`${apiUrl}/api/boards/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: data, // ← FormData va directo
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new ValidationError(
      responseData.message || "Error al crear el tablero",
      "general"
    );
  }
};

export const deleteBoardById = async (boardId: string) => {
  const token = getToken();

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/boards/${boardId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Error al eliminar el tablero");
  }

  return res.json();
};

export const toggleFavoriteBoard = async (boardId: string) => {
  const token = getToken();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  try {
    const response = await fetch(`${apiUrl}/api/boards/${boardId}/favorite`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error al actualizar favorito:", error);
  }
};

