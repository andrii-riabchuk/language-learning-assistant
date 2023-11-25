import { useState } from "react";

export interface InputText {
  submitText: (value: string) => void;
}

export function InputText({ submitText }: InputText) {
  const [text, setText] = useState("");

  const onSubmit = () => {
    submitText(text);
  };
  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  return (
    <>
      <textarea
        onChange={onChange}
        style={{ width: "800px", height: "300px" }}
      />
      <button onClick={onSubmit}>Submit</button>
    </>
  );
}
