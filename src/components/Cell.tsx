import { useContext } from "react";
import { CursorContext, WonContext, CursorState } from "../contexts";

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

  const playerHasWon = useContext(WonContext);

  const handleClick = () => {
    if (playerHasWon) {
      return;
    }
    // Users can only click on another cell in the current row
    if (rowId !== cursor[0]) {
      return;
    }
    setCursor([rowId, colId]);
  };

  const gradeColors = ["bg-slate-400", "bg-yellow-500", "bg-green-500"];
  const gradeColor =
    grade !== null ? gradeColors[grade] : "bg-slate-100 text-slate-600";

  return (
    <div
      onClick={handleClick}
      className={`text-white font-semibold text-2xl rounded-md shadow w-20 h-20 flex justify-center items-center ${
        isFocused && "shadow-slate-400 shadow-md"
      } ${isCurrentRow && "hover:shadow-slate-400 hover:shadow-md"} 
      ${gradeColor}`}
    >
      {letter}
    </div>
  );
}
