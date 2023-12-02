import { isNormalWord, specialsSeparated } from "./string";

export interface SentenceWord {
    word: string;
    display: string;
    sentenceId: number;
    wordId: number;
    isSpecial: boolean;
}

export interface WordSentences {
    words: SentenceWord[];
    sentences: string[][];
}

export function extractWordSentences(text: string): WordSentences {
    // first divide into lines
    console.log([text])
    const lines = splitLines(text);

    for(let i=0; i < lines.length; i++) {
        
        console.log(lines[i]);
    }

    // 
    const sentencesStr = text.split(/(.*[.?!]+)/).filter(x => Boolean(x.trim()));
    console.log('sentencesStr', sentencesStr)
    console.log("here is your shit", sentencesStr)
    const words: SentenceWord[] = [];
    const sentences: string[][] = [];
    sentencesStr.forEach((sentence, i) => {
        const sentenceWords = sentence.split(' ');
        sentences.push(sentenceWords);
        sentenceWords.forEach((word, j) => {
            const wordCleaned = specialsSeparated(word)[0];
            words.push({
                display: word,
                word: wordCleaned, sentenceId: i, wordId: j, isSpecial: !isNormalWord(word)
            });
        });
    });

    return {words: words, sentences: sentences};
}

function splitLines(text: string): string[]{
    if (!text) return [];

    // ensure it has \n at the end
    if (text[text.length-1] != '\n'){
        text += '\n';
    }

    const lines: string[] = [];
    let lastLineIndex = -1;
    for(let i=0; i < text.length; i++){
        if (text[i] === "\n"){
            lines.push(text.slice(lastLineIndex + 1, i));
            lastLineIndex = i;
        }
    }
    
    return lines;
}

export function clean(text: string){
    let cleaned = text.replace(/  +/g, ' ');

    // remove whitespaces before sentences separators
    cleaned = cleaned.replace(/\s+([.?!])/g, '$1');

    // add whitespaces after sentences separators
    cleaned = cleaned.replace(/([.,:—?!])(?!\s)/g, '$1 ');

    return cleaned;
  }