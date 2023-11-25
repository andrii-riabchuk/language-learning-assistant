import { useState } from "react";
import "./App.css";
import { InputText } from "./InputText/InputText";
import LanguageAssistant from "./LanguageAssistant/LanguageAssistant";

function getWordFromTextByIndex(i: number, text: string) {
  text += " ";
  const words: string[] = [];
  const wordByCharIndex = Array(text.length);
  let prevWordLastCharIndex = 0;
  let curWordIndex = 0;
  for (let i = 0; i < text.length; i++) {
    wordByCharIndex[i] = curWordIndex;
    if (text[i] == " ") {
      words.push(text.slice(prevWordLastCharIndex, i));
      curWordIndex++;
      prevWordLastCharIndex = i + 1;
    }
  }

  return words[wordByCharIndex[i]];
}

function App() {
  const [isTextSubmited, setIsTextSubmited] = useState(false);
  const [submitedText, setSubmitedText] = useState("");

  const [textFromEvent, setTextFromEvent] = useState("");

  const onSubmit = (value: string) => {
    setIsTextSubmited(true);
    setSubmitedText(value);
  };

  return isTextSubmited ? (
    // <h1>submited {submitedText}</h1>
    <LanguageAssistant forText={submitedText} />
  ) : (
    <>
      {/* <textarea className="main-text-area" onClick={onTextAreaClick} /> */}
      <InputText submitText={onSubmit} />
      <div>Dev debug: [{textFromEvent}]</div>
    </>
  );
}

export default App;
