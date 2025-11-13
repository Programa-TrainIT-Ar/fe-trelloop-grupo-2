import { getToken } from "store/authStore";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface ApiComment {
  id: number;
  card_id: number;
  user_id: number;
  comment: string;
  created_at: string;
}

export async function getCardComments(
  boardId: number,
  listId: number,
  cardId: number
): Promise<ApiComment[]> {
  const token = getToken();
  const res = await fetch(
    `${API_URL}/api/boards/${boardId}/lists/${listId}/cards/${cardId}/comments`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message || "No se pudieron obtener los comentarios");
  }

  const data = await res.json();
  return Array.isArray(data?.comments) ? (data.comments as ApiComment[]) : [];
}

export async function createCardComment(
  boardId: number,
  listId: number,
  cardId: number,
  comment: string
): Promise<ApiComment> {
  const token = getToken();
  const res = await fetch(
    `${API_URL}/api/boards/${boardId}/lists/${listId}/cards/${cardId}/comments`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ comment }),
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error || err?.message || "No se pudo crear el comentario");
  }

  const data = await res.json();
  // la API devuelve { success, message, comment }
  return data?.comment as ApiComment;
}