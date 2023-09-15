import { useState, useEffect, useCallback } from "react";
import { evaluateGuess } from "./mechanics";
import { CursorContext, Position, GameStateContext } from "./contexts";

import { RestartButton, RevealButton } from "./components/buttons";
import Grid from "./components/Grid";
import ResultModal from "./components/ResultModal";
import { GameState } from "./types";

const numAttempts = 6;

export default function App() {
  const answer = "REACT";

  const initialWords = Array.from({ length: numAttempts }, () =>
    Array.from({ length: 5 }, () => "")
  );
  const initialGrades = Array.from({ length: numAttempts }, () =>
    Array.from({ length: 5 }, () => null)
  );

  const [words, setWords] = useState(initialWords);

  const [gradeHistory, setGradeHistory] =
    useState<(number | null)[][]>(initialGrades);
  const [cursor, setCursor] = useState<Position>([0, 0]);

  const [gameState, setGameState] = useState<GameState>("ongoing");
  const [modalIsVisible, setModalIsVisible] = useState(false);

  const handleRestart = () => {
    setWords(initialWords);
    setGradeHistory(initialGrades);
    setCursor([0, 0]);
    setGameState("ongoing");
  };

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

    setGradeHistory((prevGradeHistory) => {
      const newGradeHistory = prevGradeHistory.slice();
      newGradeHistory[cursor[0]] = grades;
      return newGradeHistory;
    });

    if (guessIsCorrect) {
      setGameState("win");
      setModalIsVisible(true);
      return;
    }

    // Out of moves
    if (cursor[0] === numAttempts - 1) {
      setGameState("lose");
      setModalIsVisible(true);
    }

    // Go to first cell of next row
    setCursor((prevCursor) => [prevCursor[0] + 1, 0]);
  }, [cursor, words]);

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (gameState === "win") {
        // Ignore inputs after winning
        return;
      }

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
  }, [cursor, handleBackspace, handleEnter, gameState]);

  const handleReveal = () => {
    setWords((prevWords) => {
      const newWords = prevWords.slice();
      newWords[cursor[0]] = answer.split("");
      return newWords;
    });
    setGradeHistory((prevGradeHistory) => {
      const newGradeHistory = prevGradeHistory.slice();
      newGradeHistory[cursor[0]] = Array.from({ length: 5 }, () => 3);
      return newGradeHistory;
    });
    setGameState("lose");
    setModalIsVisible(true);
  };

  return (
    <main className="flex flex-col items-center">
      <header className="shadow w-screen text-center p-4">
        <h1>WORDLE</h1>
      </header>
      <GameStateContext.Provider value={gameState}>
        <CursorContext.Provider value={{ cursor, setCursor }}>
          <section className="p-4 relative">
            <section className="absolute -left-60 w-1/2 flex flex-col gap-8">
              <div className="p-4 bg-sky-500/40 text-sky-800 rounded">
                <p>Guess the 5-letter word</p>
                <p>Hit ENTER to confirm</p>
              </div>
              <div className="flex flex-col gap-2 items-start">
                <RestartButton onClick={handleRestart} />
                <RevealButton
                  onClick={handleReveal}
                  disabled={gameState !== "ongoing"}
                />
              </div>
            </section>
            <Grid words={words} gradeHistory={gradeHistory} />
          </section>
          {modalIsVisible && (
            <ResultModal
              won={gameState === "win"}
              answer={answer}
              close={() => setModalIsVisible(false)}
            />
          )}
        </CursorContext.Provider>
      </GameStateContext.Provider>
    </main>
  );
}
