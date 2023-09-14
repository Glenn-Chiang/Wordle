import { useState, useContext, createContext, useEffect } from "react";

const WordsContext = createContext<WordsState | undefined>(undefined);

interface WordsState {
  words: string[][];
  setWords: React.Dispatch<React.SetStateAction<string[][]>>;
}

type Position = [number, number];

const CursorContext = createContext<CursorState | undefined>(undefined);

interface CursorState {
  cursor: Position;
  setCursor: React.Dispatch<React.SetStateAction<Position>>;
}

export default function App() {
  const initialWords = Array.from({ length: 6 }, () =>
    Array.from({ length: 5 }, () => "")
  );
  const [words, setWords] = useState(initialWords);
  const [cursor, setCursor] = useState<Position>([0, 0]);

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      const key = event.key;

      // Handle backspace
      if (key === "Backspace") {
        if (cursor[1] === 0) {
          return
        }
        setWords((prevWords) => {
          const newWords = prevWords.slice();
          newWords[cursor[0]][cursor[1] - 1] = "";
          return newWords;
        });
        setCursor((prevCursor) => {
          const newCursor = prevCursor.slice() as Position;
          newCursor[1] = prevCursor[1] - 1;
          return newCursor;
        });
        return;
      }

      if (!/^[a-zA-Z]$/.test(key)) {
        return;
      }
      if (cursor[1] >= 5) {
        return;
      }

      setWords((prevWords) => {
        const newWords = prevWords.slice();
        newWords[cursor[0]][cursor[1]] = key.toUpperCase();
        return newWords;
      });
      setCursor((prevCursor) => {
        const newCursor = prevCursor.slice() as Position;
        newCursor[1] = prevCursor[1] + 1;
        return newCursor;
      });
    };
    document.addEventListener("keydown", handleKeydown);

    return () => document.removeEventListener("keydown", handleKeydown);
  }, [cursor]);

  return (
    <main className="flex flex-col items-center">
      <header className="shadow w-screen text-center p-4">
        <h1>WORDLE</h1>
      </header>
      <WordsContext.Provider value={{ words, setWords }}>
        <CursorContext.Provider value={{ cursor, setCursor }}>
          <section className="p-4 relative">
            <p className="absolute -left-60 p-4 bg-sky-500/40 text-sky-800 rounded">
              Guess the 5-letter word
            </p>
            <Grid words={words} />
          </section>
        </CursorContext.Provider>
      </WordsContext.Provider>
    </main>
  );
}

type GridProps = {
  words: string[][];
};

function Grid({ words }: GridProps) {
  const numRows = 6;
  const rows = Array.from({ length: numRows }, () => null);
  return (
    <ul className="flex flex-col gap-8">
      {rows.map((_, index) => (
        <Row key={index} rowId={index} letters={words[index]} />
      ))}
    </ul>
  );
}

type RowProps = {
  rowId: number;
  letters: string[];
};

function Row({ rowId, letters }: RowProps) {
  const numCells = 5;
  const cells = Array.from({ length: numCells }, () => null);
  return (
    <li className="flex gap-2">
      {cells.map((_, index) => (
        <Cell key={index} rowId={rowId} colId={index} letter={letters[index]} />
      ))}
    </li>
  );
}

type CellProps = {
  rowId: number;
  colId: number;
  letter: string;
};

function Cell({ rowId, colId, letter }: CellProps) {
  const { cursor, setCursor } = useContext(CursorContext) as CursorState;
  const isFocused = cursor[0] === rowId && cursor[1] === colId;
  const isCurrentRow = cursor[0] === rowId;
  // const {setWords}  = useContext(WordsContext) as WordsState

  const handleClick = () => {
    // Users can only click on another cell in the current row
    if (rowId !== cursor[0]) {
      return;
    }
    setCursor([rowId, colId]);
  };

  return (
    <div
      onClick={handleClick}
      className={`font-semibold text-xl rounded-md shadow w-20 h-20 bg-slate-100 flex justify-center items-center ${
        isFocused && "shadow-slate-400 shadow-md"
      } ${isCurrentRow && "hover:shadow-slate-400 hover:shadow-md"}`}
    >
      {letter}
    </div>
  );
}
