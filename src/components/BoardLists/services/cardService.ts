export const updateCardPosition = async (
  boardId: string | number,
  listId: string | number,
  cardId: number,
  newPosition: number,
  token: string
) => {
  if (!token) throw new Error("JWT token missing");

  const response = await fetch(
    `http://127.0.0.1:5000/api/boards/${boardId}/lists/${listId}/cards/${cardId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ position: newPosition, list_id: listId }),
    }
  );

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || "Error actualizando posición");
  }

  return await response.json();
};
