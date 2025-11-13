export interface BoardList {
  board_id: number;
  cards: any[]; // modificar cuando se conozca la estructura de cada card
  created_at: string;
  id: number;
  name: string;
  position: number;
}