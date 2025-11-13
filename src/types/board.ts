export interface CreateBoardPayload {
    name: string;
    description: string;
    status: "PRIVATE" | "PUBLIC";
    tags: string[];
    members: string[]; // IDs de usuarios
    boardImageUrl: string | null;
  }
  