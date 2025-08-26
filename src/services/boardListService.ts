import { getToken } from "../store/authStore";
import { BoardList } from "types/boardList";

export const getBoardListsService = async (boardId: string): Promise<BoardList[]> => {
  const token = getToken();

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    console.warn("No se ha definido NEXT_PUBLIC_API_URL");
    return [];
  }
  console.log(`Obteniendo listas del tablero: ${boardId}`);
  try {
    const response = await fetch(`${apiUrl}/api/boards/${boardId}/lists`, {
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
    console.log(data)
    return data;
  } catch (error) {
    console.error("Error al obtener tableros del backend:", error);
    return [];
  }
};