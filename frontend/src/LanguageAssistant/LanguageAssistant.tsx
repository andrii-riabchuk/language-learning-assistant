import React, { useEffect, useRef, useState } from "react";
import { toClip, toCsv } from "../utils/export";
import { compareIgnoreCase, getLineFeed, specialsSeparated } from "../utils/string";

import "./LanguageAssistant.css";
import { lookUp } from "../api/myapi";
import CrossButton from "../ui/CrossButton/CrossButton";
import { clean, extractWordSentences } from "../utils/language";

export interface LanguageAssistantProps {
  forText: string;
}

export interface Definition {
  word: string;
  meanings: string[][];
}

export default function LanguageAssistant({ forText }: LanguageAssistantProps) {
  const text = clean(forText);
  let words = text.split(" ").filter(Boolean);

  // -----------------------------------------------
  const wordSentences = extractWordSentences(text);
  console.log(wordSentences.words.length);
  console.log(words.length);
  const arr1 = wordSentences.words.map(x => x.display);
  const arr2 = words;
  console.log(arr1);
  console.log(arr2);
  console.log(arr1.filter(x => !arr2.includes(x)))
  words = arr1;
  // -----------------------------------------------
  
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const lastAddedWordRef = useRef<HTMLTableRowElement>(null);

  const addSelectedWord = (word: string) => {
    if (!selectedWords.find((x) => compareIgnoreCase(x, word)))
      setSelectedWords([...selectedWords, word]);
  };

  useEffect(() => {
    lastAddedWordRef.current?.scrollIntoView();
  }, [selectedWords]);

  const [definition, setDefinition] = useState<Definition>();
  function lookUpDefinitions() {
    
  }

  const onTextAreaClick = (e: React.MouseEvent<HTMLSpanElement>) => {
    const element = e.currentTarget;
    
    const word = specialsSeparated(words[Number(element.id)])[0];
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
  console.log("definition:", definition);

  return (
    <>
      <div className="column">
        <h2>🤗🤗🤗</h2>
        <div className="textContainer">
          {words.map((word, i) => {
            const separated = specialsSeparated(word);
            const wordBody = separated[0],
              specials = separated[1];
            const lf = getLineFeed(specials);
            console.log([wordBody], specials, lf)

            return (
              <>
                
                <span
                  key={word + i.toString()}
                  id={i.toString()}
                  className="word"
                  onClick={onTextAreaClick}
                >
                  {wordBody}
                </span>
                {specials + " "}
                {lf ? Array(lf).map(()=><br/>) : null}
              </>
            );
          })}
        </div>
      </div>
      <div className="column">
        <h2></h2>
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
        <h2><button onClick={lookUpDefinitions}>Lookup</button></h2>
        <div className="definition" />
        {definition?.word}
        <br />
        {definition?.meanings?.map((x) => x.join(",")).join(" || ")}
      </div>
    </>
  );
}
