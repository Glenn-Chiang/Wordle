type GameState = "win" | "lose" | "ongoing";

interface Message {
  text: string;
  style: string;
}
export type { GameState, Message };
