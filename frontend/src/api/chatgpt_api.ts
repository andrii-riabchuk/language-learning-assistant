
const baseUrl = "http://127.0.0.1:8000/definition";

export interface WordDefinitionRequest {
    word: string;
    context: string;
}

export async function requestDefinitions(words: WordDefinitionRequest[]) {
    console.log("supposed body- ", JSON.stringify(words));

    const res = await fetch(baseUrl, {
        method: "POST",
        body: JSON.stringify(words),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    }).then(x => x.json());

    console.log(res);
}