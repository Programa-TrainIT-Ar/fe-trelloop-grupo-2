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

export const deleteListService = async ({
  boardId,
  listId,
}: {
  boardId: number;
  listId: number;
}): Promise<void> => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const token = authController.token;

  if (!token) {
    throw new ValidationError("No hay token de autenticación.", "general");
  }
  if (!apiUrl) {
    throw new ValidationError("No se ha definido la URL de la API.", "general");
  }

  const res = await fetch(`${apiUrl}/api/boards/${boardId}/lists/${listId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  // Backend responde 204 sin body al borrar correctamente
  if (res.status === 204) return;

  // Si no fue 204 ni ok, levantamos el error del backend (si lo hay)
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const msg = body?.error || body?.message || "No se pudo eliminar la lista";
    throw new ValidationError(msg, "general");
  }
};
