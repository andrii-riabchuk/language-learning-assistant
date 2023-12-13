export interface WordDefinitionRequest {
    word: string;
    context: string;
}

export interface DictionaryEntry {
    word: string;
    base: string;
    definition: string;
    pos: string;
    gender?: string;
}