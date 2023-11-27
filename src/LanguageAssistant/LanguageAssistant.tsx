import React, { useEffect, useRef, useState } from "react";
import { toClip, toCsv } from "../utils/export";
import { compareIgnoreCase, specialsSeparated } from "../utils/string";

import "./LanguageAssistant.css";
import { lookUp } from "../api/colinsapi";
import CrossButton from "../ui/CrossButton/CrossButton";

export interface LanguageAssistantProps {
  forText: string;
}

export default function LanguageAssistant({ forText }: LanguageAssistantProps) {
  const text = forText;
  const words = text.split(" ");
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const lastAddedWordRef = useRef<HTMLTableRowElement>(null);

  const addSelectedWord = (word: string) => {
    if (!selectedWords.find((x) => compareIgnoreCase(x, word)))
      setSelectedWords([...selectedWords, word]);
    // lookUp(word, onLookUp);
  };

  useEffect(() => {
    lastAddedWordRef.current?.scrollIntoView();
  }, [selectedWords]);

  const [definition, setDefinition] = useState<Element>();
  const onLookUp = (r: Element) => {
    setDefinition(r);
  };

  console.log(words);

  const onTextAreaClick = (e: React.MouseEvent<HTMLSpanElement>) => {
    const textAreaElement = e.currentTarget;
    const word = textAreaElement.innerText.trim();
    addSelectedWord(word);
  };

  const onCrossClick = (i: number) => {
    function f() {
      setSelectedWords(selectedWords.toSpliced(i, 1));
    }
    return f;
  };

  const onCopyClick = () => toClip(selectedWords);
  const onExportClick = () => toCsv(selectedWords);

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
        <button onClick={onCopyClick}>Copy</button>
        <button onClick={onExportClick}>Export</button>
        <div className="word-box">
          <table style={{ textAlign: "start" }}>
            {selectedWords.map((x, i) => {
              const itemProps =
                i == selectedWords.length - 1 ? { ref: lastAddedWordRef } : {};
              return (
                <tr key={x + i} {...itemProps}>
                  <td style={{ width: "150px" }}>
                    {i + 1}. {x}
                  </td>
                  <td>
                    <CrossButton onClick={onCrossClick(i)} />
                  </td>
                </tr>
              );
            })}
          </table>
        </div>
        {/* <button onClick={() => lookUp("", onLookUp)}>Lookup</button> */}
      </div>
      <div className="column">
        <h2>Lookup</h2>
        <div
          className="definition"
          dangerouslySetInnerHTML={{ __html: definition?.innerHTML ?? "" }}
        />
      </div>
    </>
  );
}
