const wordLength = 5;

const evaluateGuess = (guess: string, answer: string) => {
  const grades = Array.from({ length: 5 }, () => 0);

  for (let i = 0; i < wordLength; i++) {
    // Answer includes letter, but may not be in correct position
    if (answer.includes(guess[i])) {
      grades[i] = 1;
    }
    // Letter is at correct position
    if (guess[i] === answer[i]) {
      grades[i] = 2;
    }
  }

  return grades
};

export { evaluateGuess };
