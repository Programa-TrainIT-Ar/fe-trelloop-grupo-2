import { CreateBoardPayload } from "../types/board";
import { ValidationError } from "../types/validatesError";
import { createBoardService } from "../services/boardService";
// import { createBoard } from "services/boardService";

export async function createBoardController(data: FormData): Promise<void> {
  const name = data.get("name")?.toString() || "";

  if (!name || name.trim().length < 3) {
    throw new ValidationError("El nombre del tablero es obligatorio y debe tener al menos 3 caracteres.", "name");
  }

  return await createBoardService(data);
}


