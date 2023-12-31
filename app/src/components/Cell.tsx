import { useContext } from "react";
import { CursorContext, GameStateContext, CursorState } from "../contexts";

type props = {
  rowId: number;
  colId: number;
  letter: string;
  grade: number | null;
};

export default function Cell({ rowId, colId, letter, grade }: props) {
  const { cursor, setCursor } = useContext(CursorContext) as CursorState;
  const isFocused = cursor[0] === rowId && cursor[1] === colId;
  const isCurrentRow = cursor[0] === rowId;
  const gameState = useContext(GameStateContext);

  const handleClick = () => {
    if (gameState !== 'ongoing') {
      return;
    }
    // Users can only click on another cell in the current row
    if (rowId !== cursor[0]) {
      return;
    }
    setCursor([rowId, colId]);
  };

  const gradeColors = [
    "bg-slate-400 text-white",
    "bg-yellow-500 text-white",
    "bg-green-500 text-white",
    "bg-sky-500 text-white",
  ];
  const color =
    grade !== null
      ? gradeColors[grade]
      : `bg-slate-100 text-slate-600 ${letter && "border-2 border-slate-400"}`;

  return (
    <div
      onClick={handleClick}
      className={`font-semibold text-2xl rounded-md shadow w-20 h-20 flex justify-center items-center ${
        isFocused && "shadow-slate-400 shadow-md"
      } ${isCurrentRow && "hover:shadow-slate-400 hover:shadow-md"} 
      ${color}`}
    >
      {letter}
    </div>
  );
}
