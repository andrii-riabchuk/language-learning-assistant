import { DictionaryEntry, WordDefinitionRequest } from "./types";

const baseUrl = "http://127.0.0.1:8000/definition";

export async function requestDefinitions(words: WordDefinitionRequest[], callback: (definitions: DictionaryEntry[]) => void): Promise<void> {
    console.log("supposed body- ", JSON.stringify(words));

    const res: DictionaryEntry[] = await fetch(baseUrl, {
        method: "POST",
        body: JSON.stringify(words),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    }).then(x => x.json()).catch(_ => { });

    if (Array.isArray(res)) {
        return callback(res);
    } else {
        console.log("Incorrect api response", res);
        // return callback(res);
    }
}