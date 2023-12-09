import { requestDefinitions } from "./chatgpt_api";
import { DictionaryEntry, WordDefinitionRequest } from "./types";

export class Dictionary {
    storage: { [key: string]: DictionaryEntry } = {};

    get(word: string): DictionaryEntry {
        return this.storage[word.toLowerCase()];
    }

    set(word: string, definition: DictionaryEntry) {
        this.storage[word.toLocaleLowerCase()] = definition;
    }

    async loadDefinitions(words: WordDefinitionRequest[]) {
        const wordsToRequest: WordDefinitionRequest[] = [];

        words.forEach((wq) => {
            if (!this.get(wq.word)) {
                wordsToRequest.push(wq);
            }
        });

        if (wordsToRequest.length) {
            await requestDefinitions(wordsToRequest, (definitions: DictionaryEntry[]) => {
                definitions.forEach((def) => {
                    this.set(def.word, def);
                })
            })
        }
    }
}