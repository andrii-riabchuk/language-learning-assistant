import { isNormalWord, specialsSeparated } from "./string";

export interface Text {
    lines: WordSentences[];
}

export interface WordSentences {
    words: SentenceWord[];
    sentences: string[][];
    IsEmpty: boolean;
}

export interface SentenceWord {
    word: string;
    specials: string;
    lineId: number;
    sentenceId: number;
    wordId: number;
    isSpecial: boolean;
}

export function getWordContext(text: Text, sw: SentenceWord) {
    const line = text.lines[sw.lineId];
    const sentences = line.sentences;
    
    // sentence - list of words
    const sentence = sentences[sw.sentenceId];

    // neighbourhood of 3 items from left and right
    const from = Math.max(0, sw.wordId - 3);
    const to = Math.min(sentence.length, sw.wordId + 3);
    const neighbourhood = sentence.slice(from, to);

    return neighbourhood.join(" ");
}

export function extractSentencesLines(text: string): Text {
    return {lines: splitLines(text).map((str, i) => extractWordSentences(str, i))};
}

function extractWordSentences(text: string, lineId: number) : WordSentences {
    if (!text) {
        return {words: [], sentences:[], IsEmpty: true }
    }

    const sentencesStr = text.split(/(.*[.?!]+)/).filter(x => Boolean(x.trim()));
    const words: SentenceWord[] = [];
    const sentences: string[][] = [];
    sentencesStr.forEach((sentence, i) => {
        const sentenceWords = sentence.split(' ');
        sentences.push(sentenceWords);
        sentenceWords.forEach((word, j) => {
            if (isNormalWord(word)){
                const separ = specialsSeparated(word);
                words.push({
                    specials: separ[1],
                    word: separ[0],
                    lineId: lineId,
                    sentenceId: i, wordId: j, isSpecial: false
                });
            } else {
                words.push({isSpecial: true, word: word, specials: "",lineId: lineId, sentenceId: i, wordId: j})
            }
        });
    });

    return {words: words, sentences: sentences, IsEmpty: false};
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