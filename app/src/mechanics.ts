import words from './wordbank'

const wordLength = 5;

const getWord = (): string => {
  const randomIndex = Math.floor(Math.random() * words.length)
  const randomWord = words[randomIndex]
  return randomWord
}

const checkWordValidity = (word: string) => {
  return words.includes(word.toLowerCase())
}

const getLetterCount = (word: string): { [letter: string]: number } => {
  const letterCount: { [letter: string]: number } = {};
  for (const letter of word) {
    if (letterCount[letter]) {
      letterCount[letter]++;
    } else {
      letterCount[letter] = 1;
    }
  }
  return letterCount;
};

const evaluateGuess = (guess: string, answer: string) => {
  const letterCount = getLetterCount(answer);
  const grade = Array.from({ length: wordLength }, () => 0);

  for (let i = 0; i < wordLength; i++) {
    // Letter is at correct position
    if (guess[i] === answer[i]) {
      grade[i] = 2;
      letterCount[guess[i]]--;
    }
  }

  for (let i = 0; i < wordLength; i++) {
    // Answer includes letter, but may not be in correct position
    if (
      answer.includes(guess[i]) &&
      letterCount[guess[i]] > 0 &&
      grade[i] !== 2
    ) {
      grade[i] = 1;
      letterCount[guess[i]]--;
    }
  }

  return grade;
};

export { getWord, evaluateGuess, checkWordValidity };
