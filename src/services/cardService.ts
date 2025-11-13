import { getToken } from "store/authStore";
import { ValidationError } from "types/validatesError";


export const deleteCardById = async (boardId: number, listId: number, cardId: number) => {
  const token = getToken();

  if (!token) throw new ValidationError("No hay token de autenticación.", "general");

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/boards/${boardId}/lists/${listId}/cards/${cardId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Error al eliminar la tarjeta: ${res.status} ${res.statusText}`);
  }

  // Verificar si hay contenido en la respuesta antes de parsear JSON
  const contentType = res.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    try {
      return await res.json();
    } catch (error) {
      // Si no hay JSON válido, devolver un objeto vacío
      return {};
    }
  } else {
    // Si no es JSON, devolver un objeto vacío
    return {};
  }
};

export const updateListCardById = async (boardId: number, listId: number, cardId: number, card: any) => {
  const token = getToken();

  if (!token) throw new ValidationError("No hay token de autenticación.", "general");

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/boards/${boardId}/lists/${listId}/cards/${cardId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(card),
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new ValidationError(responseData.message || "Error al actualizar la tarjeta", "general");
  }

  return responseData;
};

export async function getCardById(boardId: number, listId: number, cardId: number) {
  const { getToken } = await import("store/authStore");
  const token = getToken();
  const API = process.env.NEXT_PUBLIC_API_URL;
  if (!API) throw new Error("No se ha definido NEXT_PUBLIC_API_URL");

  const res = await fetch(`${API}/api/boards/${boardId}/lists/${listId}/cards/${cardId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Error HTTP ${res.status}`);
  return res.json(); // { success: true, card: {...} }
}

export async function moveCardToList(
  boardId: number,
  currentListId: number,
  cardId: number,
  newListId: number
) {
  const { getToken } = await import("store/authStore");
  const token = getToken();
  const API = process.env.NEXT_PUBLIC_API_URL;
  if (!API) throw new Error("No se ha definido NEXT_PUBLIC_API_URL");

  const res = await fetch(`${API}/api/boards/${boardId}/lists/${currentListId}/cards/${cardId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ list_id: newListId }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({} as any));
    throw new Error(body?.error || body?.message || "No se pudo mover la tarjeta");
  }
  return res.json();
}
