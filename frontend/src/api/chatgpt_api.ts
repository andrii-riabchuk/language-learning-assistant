import { DictionaryEntry, WordDefinitionRequest } from "./types";

const baseUrl = "http://127.0.0.1:8000/definition";

export async function requestDefinitions(words: WordDefinitionRequest[], callback: (definitions: DictionaryEntry[]) => void) {
    console.log("supposed body- ", JSON.stringify(words));

    const res: DictionaryEntry[] = await fetch(baseUrl, {
        method: "POST",
        body: JSON.stringify(words),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    }).then(x => x.json());

    if (Array.isArray(res)) {
        callback(res);
    } else {
        throw Error("Incorrect api response");
    }
}