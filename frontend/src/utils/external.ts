export function getCollinsLink(word: string): string {
    const url = `https://www.collinsdictionary.com/dictionary/french-english/${word}`;
    return url;
}

export function getGoogleLink(word: string): string {
    const url = `https://www.google.com/search?q=${word} french meaning`;
    return url;
}