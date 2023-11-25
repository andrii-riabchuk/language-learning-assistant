import React, { useEffect, useRef, useState } from "react";
import "./LanguageAssistant.css";

export interface LanguageAssistantProps {
  forText: string;
}

function specialsSeparated(str: string): string[] {
  if (str.match(/.*[.,!?]/)) {
    return [str.slice(0, str.length - 1), str.charAt(str.length - 1)];
  } else {
    return [str, ""];
  }
}

function compareIgnoreCase(str1: string, str2: string) {
  return str1.toLocaleLowerCase() == str2.toLocaleLowerCase();
}

export default function LanguageAssistant({ forText }: LanguageAssistantProps) {
  const text = forText;
  const words = text.split(" ");
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const lastAddedWordRef = useRef<HTMLTableRowElement>(null);

  const addSelectedWord = (word: string) => {
    if (!selectedWords.find((x) => compareIgnoreCase(x, word)))
      setSelectedWords([...selectedWords, word]);
  };

  useEffect(() => {
    lastAddedWordRef.current?.scrollIntoView();
  }, [selectedWords]);

  console.log(words);

  const onTextAreaClick = (e: React.MouseEvent<HTMLSpanElement>) => {
    const textAreaElement = e.currentTarget;
    const word = textAreaElement.innerText.trim();
    addSelectedWord(word);
    console.log("selected word", word);
  };

  const onCopyClick = () => {
    navigator.clipboard.writeText(
      selectedWords.map((word) => word + "\n").join("")
    );
  };
  const onExportClick = () => {
    const rows = [
      ["name1", "city1", "some other info"],
      ["name2", "city2", "more info"],
    ];

    const csvContent =
      "data:text/csv;charset=utf-8," + rows.map((e) => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    window.open(encodedUri);
  };

  return (
    <>
      <div className="column">
        <h2>Language Assistant</h2>
        <div className="textContainer">
          {words.map((word, i) => {
            const separated = specialsSeparated(word);
            const wordBody = separated[0],
              specials = separated[1];
            return (
              <>
                <span
                  key={word + i.toString()}
                  className="word"
                  onClick={onTextAreaClick}
                >
                  {wordBody}
                </span>
                {specials + " "}
              </>
            );
          })}
        </div>
      </div>
      <div className="column">
        <h2>Word list</h2>
        <div className="word-box">
          <table style={{ textAlign: "start" }}>
            {selectedWords.map((x, i) => {
              const itemProps =
                i == selectedWords.length - 1 ? { ref: lastAddedWordRef } : {};
              return (
                <tr key={x + i} {...itemProps}>
                  <td>
                    {i + 1}. {x}
                  </td>
                </tr>
              );
            })}
          </table>
        </div>
        <button onClick={onCopyClick}>Copy</button>
        <button onClick={onExportClick}>Export</button>
      </div>
    </>
  );
}
