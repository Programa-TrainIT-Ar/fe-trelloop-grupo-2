import { searchUsersService } from "services/userService";

export async function searchUsersController(query: string) {
  try {
    const users = await searchUsersService(query);
    return users;
  } catch (error) {
    console.error("Error en searchUsersController:", error);
    throw error;
  }
}
