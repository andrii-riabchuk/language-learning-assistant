import { requestDefinitions } from "./chatgpt_api";
import { DictionaryEntry, WordDefinitionRequest } from "./types";

export class Dictionary {
    storage: { [key: string]: DictionaryEntry } = {};

    get(word: string): DictionaryEntry {
        return this.storage[word];
    }

    set(word: string, definition: DictionaryEntry) {
        this.storage[word] = definition;
    }

    loadDefinitions(words: WordDefinitionRequest[]) {
        const wordsToRequest: WordDefinitionRequest[] = [];

        words.forEach((wq) => {
            if (!this.get(wq.word)) {
                wordsToRequest.push(wq);
            }
        });

        if (wordsToRequest.length) {
            requestDefinitions(wordsToRequest, (definitions: DictionaryEntry[]) => {
                definitions.forEach((def) => {
                    this.set(def.word, def);
                })
            })
        }
    }
}