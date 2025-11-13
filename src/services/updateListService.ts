import { authController } from "controllers/authController";
import { ValidationError } from "types/validatesError";

export const updateListService = async (boardId: number, listId: number, name: string) => {
  const token = authController.token;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!token) throw new ValidationError("No hay token de autenticación.", "general");
  if (!apiUrl) throw new ValidationError("No se ha definido la URL de la API.", "general");

  const response = await fetch(`${apiUrl}/api/boards/${boardId}/lists/${listId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name }),
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new ValidationError(responseData.message || "Error al actualizar la lista", "general");
  }

  return responseData;
};
