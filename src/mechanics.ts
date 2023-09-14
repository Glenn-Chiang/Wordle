const wordLength = 5;

const evaluateGuess = (guess: string, answer: string) => {
  const grade = Array.from({ length: 5 }, () => 0);

  for (let i = 0; i < wordLength; i++) {
    // Answer includes letter, but may not be in correct position
    if (answer.includes(guess[i])) {
      grade[i] = 1;
    }
    // Letter is at correct position
    if (guess[i] === answer[i]) {
      grade[i] = 2;
    }
  }

  return grade
};

export { evaluateGuess };
