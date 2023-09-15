import Cell from "./Cell";

type props = {
  rowId: number;
  letters: string[];
  grades: (number | null)[];
};

export default function Row({ rowId, letters, grades }: props) {
  const numCells = 5;
  const cells = Array.from({ length: numCells }, () => null);
  return (
    <li className="flex gap-2">
      {cells.map((_, index) => (
        <Cell
          key={index}
          rowId={rowId}
          colId={index}
          letter={letters[index]}
          grade={grades[index]}
        />
      ))}
    </li>
  );
}
