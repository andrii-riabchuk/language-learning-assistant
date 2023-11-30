import { Definition } from "../LanguageAssistant/LanguageAssistant";

const baseUrl = "http://127.0.0.1:8000/definition";

export function lookUp(
  word: string,
  callback: (definition: Definition) => void
) {
  const url = `${baseUrl}/${word}`;

  fetch(url)
    .then((res) => {
      //   console.log("res.body", res.body);
      //   console.log("res.json", res.json());
      return res.json();
    })
    .then((obj) => {
      console.log(
        "here is your obj",
        obj,
        Object.keys(obj),
        "now calling your callback"
      );
      callback(obj);
    });
}
