import Row from "./Row";

type GridProps = {
  words: string[][];
  gradeHistory: (number | null)[][];
};

export default function Grid({ words, gradeHistory }: GridProps) {
  const numRows = 6;
  const rows = Array.from({ length: numRows }, () => null);
  return (
    <ul className="flex flex-col gap-8">
      {rows.map((_, index) => (
        <Row
          key={index}
          rowId={index}
          letters={words[index]}
          grades={gradeHistory[index]}
        />
      ))}
    </ul>
  );
}
