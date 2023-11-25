import { useState } from "react";
import "./App.css";
import { InputText } from "./InputText/InputText";
import LanguageAssistant from "./LanguageAssistant/LanguageAssistant";

function App() {
  const [isTextSubmited, setIsTextSubmited] = useState(false);
  const [submitedText, setSubmitedText] = useState("");

  const onSubmit = (value: string) => {
    setIsTextSubmited(true);
    setSubmitedText(value);
  };

  return isTextSubmited ? (
    <LanguageAssistant forText={submitedText} />
  ) : (
    <>
      <InputText submitText={onSubmit} />
    </>
  );
}

export default App;
