import { useState, useContext, useEffect, useCallback } from "react";
import { evaluateGuess } from "./mechanics";
import { CursorState, CursorContext, Position } from "./contexts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRefresh } from "@fortawesome/free-solid-svg-icons";
import { faUnlock } from "@fortawesome/free-solid-svg-icons/faUnlock";
import { faTrophy } from "@fortawesome/free-solid-svg-icons/faTrophy";
import { faX } from "@fortawesome/free-solid-svg-icons/faX";

export default function App() {
  const answer = "REACT";

  const initialWords = Array.from({ length: 6 }, () =>
    Array.from({ length: 5 }, () => "")
  );
  const initialGrades = Array.from({ length: 6 }, () =>
    Array.from({ length: 5 }, () => null)
  );

  const [words, setWords] = useState(initialWords);

  const [gradeHistory, setGradeHistory] =
    useState<(number | null)[][]>(initialGrades);
  const [cursor, setCursor] = useState<Position>([0, 0]);

  const [won, setWon] = useState(false);
  const [modalIsVisible, setModalIsVisible] = useState(false);

  const handleBackspace = useCallback(() => {
    const currentLetter = words[cursor[0]][cursor[1]];
    // Prevent backspacing beyond first letter
    if (cursor[1] === 0 && !currentLetter) {
      return;
    }
    setWords((prevWords) => {
      const newWords = prevWords.slice();
      if (currentLetter) {
        newWords[cursor[0]][cursor[1]] = "";
      } else {
        newWords[cursor[0]][cursor[1] - 1] = "";
      }
      return newWords;
    });
    setCursor((prevCursor) => {
      const newCursor = prevCursor.slice() as Position;
      if (!currentLetter) {
        newCursor[1] = prevCursor[1] - 1;
      }
      return newCursor;
    });
    return;
  }, [cursor, words]);

  const handleEnter = useCallback(() => {
    const currentWord = words[cursor[0]].join("");
    // prevent users from entering incomplete guesses
    if (currentWord.length !== 5) {
      return;
    }

    const grades = evaluateGuess(currentWord, answer);
    const guessIsCorrect = grades.every((grade) => grade === 2);
    if (guessIsCorrect) {
      setWon(true);
      setModalIsVisible(true);
    }

    setGradeHistory((prevGradeHistory) => {
      const newGradeHistory = prevGradeHistory.slice();
      newGradeHistory[cursor[0]] = grades;
      return newGradeHistory;
    });
    // Go to first cell of next row
    setCursor((prevCursor) => [prevCursor[0] + 1, 0]);
  }, [cursor, words]);

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      const key = event.key;

      if (key === "Backspace") {
        handleBackspace();
      }
      if (key === "Enter") {
        handleEnter();
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
  }, [cursor, handleBackspace, handleEnter]);

  return (
    <main className="flex flex-col items-center">
      <header className="shadow w-screen text-center p-4">
        <h1>WORDLE</h1>
      </header>
      <CursorContext.Provider value={{ cursor, setCursor }}>
        <section className="p-4 relative">
          <section className="absolute -left-60 w-1/2 flex flex-col gap-8">
            <div className="p-4 bg-sky-500/40 text-sky-800 rounded">
              <p>Guess the 5-letter word</p>
              <p>Hit ENTER to confirm</p>
            </div>
            <div className="flex flex-col gap-2 items-start">
              <button className="flex gap-2 items-center rounded transition w-full p-2 hover:text-teal-400 hover:shadow hover:shadow-teal-400">
                <FontAwesomeIcon icon={faRefresh} />
                Restart
              </button>
              <button className="flex gap-2 items-center rounded transition w-full p-2 hover:text-teal-400 hover:shadow hover:shadow-teal-400">
                <FontAwesomeIcon icon={faUnlock} />
                Reveal solution
              </button>
            </div>
          </section>
          <Grid words={words} gradeHistory={gradeHistory} />
        </section>
        {modalIsVisible && (
          <WinModal answer={answer} close={() => setModalIsVisible(false)} />
        )}
      </CursorContext.Provider>
    </main>
  );
}

type WinModalProps = {
  answer: string;
  close: () => void;
};

function WinModal({ answer, close }: WinModalProps) {
  return (
    <div className="w-screen h-screen fixed z-10 left-0 top-0 bg-teal-500/40 flex justify-center items-center">
      <section className="bg-white rounded-xl p-4 w-1/2 flex flex-col items-center relative">
        <h1 className="text-2xl flex items-center gap-2 text-teal-500">
          <FontAwesomeIcon icon={faTrophy} />
          You Win!
        </h1>
        <FontAwesomeIcon
          onClick={close}
          icon={faX}
          className="absolute right-4"
        />
        <div className="p-2 text-center">
          <p>Answer</p>
          <p className="text-2xl">{answer}</p>
        </div>
      </section>
    </div>
  );
}

type GridProps = {
  words: string[][];
  gradeHistory: (number | null)[][];
};

function Grid({ words, gradeHistory }: GridProps) {
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

type RowProps = {
  rowId: number;
  letters: string[];
  grades: (number | null)[];
};

function Row({ rowId, letters, grades }: RowProps) {
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

type CellProps = {
  rowId: number;
  colId: number;
  letter: string;
  grade: number | null;
};

function Cell({ rowId, colId, letter, grade }: CellProps) {
  const { cursor, setCursor } = useContext(CursorContext) as CursorState;
  const isFocused = cursor[0] === rowId && cursor[1] === colId;
  const isCurrentRow = cursor[0] === rowId;

  const handleClick = () => {
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
