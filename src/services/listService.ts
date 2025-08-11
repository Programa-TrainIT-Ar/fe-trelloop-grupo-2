import { authController } from "controllers/authController";
import { ValidationError } from "types/validatesError";

export const createListService = async (payload: {
  name: string;
  side: string;
  boardId: number;
}): Promise<void> => {
  const token = authController.token;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!token) {
    throw new ValidationError("No hay token de autenticación.", "general");
  }

  if (!apiUrl) {
    throw new ValidationError("No se ha definido la URL de la API.", "general");
  }

  const response = await fetch(
    `${apiUrl}/api/boards/${payload.boardId}/lists`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json", 
      },
      body: JSON.stringify(payload),
    }
  );

  const responseData = await response.json();

  if (!response.ok) {
    throw new ValidationError(
      responseData.message || "Error al crear la lista",
      "general"
    );
  }
};
