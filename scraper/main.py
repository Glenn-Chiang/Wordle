from bs4 import BeautifulSoup
import requests
import json

def main():
    wordsData = []
    urls = ['https://www.thefreedictionary.com/5-letter-words.htm',
            'https://www.thefreedictionary.com/5-letter-words-2.htm']
    for url in urls:
        response = requests.get(url=url)
        markup = response.text
        soup = BeautifulSoup(markup, 'html.parser')
        wordList = soup.select_one('div.TCont>ul')
        wordElements = wordList.select('li>a')
        words = [wordElement.text for wordElement in wordElements]
        for word in words:
            wordsData.append(word)

    with open('wordbank.json', 'w') as file:
        json.dump(wordsData, file)

if __name__ == '__main__':
    main()
