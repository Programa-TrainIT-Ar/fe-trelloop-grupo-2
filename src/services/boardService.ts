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

  const API = process.env.NEXT_PUBLIC_API_URL;

  function authHeadersJSON() {
    const token = getToken?.();
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  // Buscar usuarios por nombre/email
  export async function searchUsers(q: string) {
    const res = await fetch(`${API}/api/users/search?q=${encodeURIComponent(q)}`, {
      method: "GET",
      headers: authHeadersJSON(),
    });
    if (!res.ok) throw new Error("Error buscando usuarios");
    return res.json(); // [{id,name,last_name,email,avatar_url}]
  }

  // Detalle de tablero con roles y rol actual
  export async function getBoardDetails(boardId: string | number) {
    const res = await fetch(`${API}/api/boards/${boardId}`, {
      method: "GET",
      headers: authHeadersJSON(),
    });
    if (!res.ok) throw new Error("No se pudo obtener el tablero");
    return res.json();
  }

  // Agregar miembro (por email) con rol
  export async function addBoardMember(
    boardId: string | number,
    payload: { email: string; role: "member" | "admin" }
  ) {
    const res = await fetch(`${API}/api/boards/${boardId}/members`, {
      method: "POST",
      headers: authHeadersJSON(),
      body: JSON.stringify(payload),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(body?.error || body?.message || "No se pudo agregar miembro");
    return body;
  }

  // Actualizar rol de miembro
  export async function updateBoardMemberRole(
    boardId: string | number,
    memberUserId: string | number,
    role: "member" | "admin" | "owner"
  ) {
    const res = await fetch(`${API}/api/boards/${boardId}/members/${memberUserId}/role`, {
      method: "PUT",
      headers: authHeadersJSON(),
      body: JSON.stringify({ role }),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(body?.error || body?.message || "No se pudo actualizar el rol");
    return body;
  }

  // Eliminar miembro
  export async function removeBoardMember(boardId: string | number, memberUserId: string | number) {
    const res = await fetch(`${API}/api/boards/${boardId}/members/${memberUserId}`, {
      method: "DELETE",
      headers: authHeadersJSON(),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(body?.error || body?.message || "No se pudo eliminar miembro");
    return body;
  }

