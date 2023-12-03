import React, { useEffect, useRef, useState } from "react";
import { toClip, toCsv } from "../utils/export";
import { compareIgnoreCase } from "../utils/string";

import "./LanguageAssistant.css";
import { lookUp } from "../api/myapi";
import CrossButton from "../ui/CrossButton/CrossButton";
import { SentenceWord, clean, extractSentencesLines } from "../utils/language";

export interface LanguageAssistantProps {
  forText: string;
}

export interface Definition {
  word: string;
  meanings: string[][];
}

export default function LanguageAssistant({ forText }: LanguageAssistantProps) {
  const text = clean(forText);

  // -----------------------------------------------
  const result = extractSentencesLines(text);
  console.log(result);
  // -----------------------------------------------
  
  const [selectedWords, setSelectedWords] = useState<SentenceWord[]>([]);
  const wordList = selectedWords.map(sw => sw.word);

  const lastAddedWordRef = useRef<HTMLTableRowElement>(null);

  const addSelectedWord = (sWord: SentenceWord) => {
    if (!selectedWords.find((x) => compareIgnoreCase(x.word, sWord.word)))
      setSelectedWords([...selectedWords, sWord]);
  };

  useEffect(() => {
    lastAddedWordRef.current?.scrollIntoView();
  }, [selectedWords]);

  const [definition, setDefinition] = useState<Definition>();
  function lookUpDefinitions() {
    
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getOnWordClick = (lineId: number, wordId: number): (e: any) => void  => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return (e: React.MouseEvent<HTMLSpanElement>) => {
      const sentenceWord = result[lineId].words[wordId];
      addSelectedWord(sentenceWord);
    };
  }

  const onCrossClick = (i: number) => {
    function f() {
      setSelectedWords(selectedWords.toSpliced(i, 1));
    }
    return f;
  };

  const onCopyClick = () => toClip(wordList);
  const onExportClick = () => toCsv(wordList);
  console.log("definition:", definition);

  return (
    <>
      <div className="column">
        <h2>🤗🤗🤗</h2>
        <div className="textContainer">
          {
            result.map((line, i) => {
              if (line.IsEmpty) return <br/>;
              return <>
                {line.words.map((sentenceWord, j) => {
                  const toRender: JSX.Element[] = [];
                  // console.log('line', i, 'sentenceWord - ', sentenceWord.word, 'specials -', sentenceWord.specials);

                  if (sentenceWord.isSpecial) {
                    toRender.push(<span>{sentenceWord.word}</span>);
                  }
                  else {
                    toRender.push(<span
                      key={i.toString() + '_' + j + '_' + sentenceWord}
                      id={i.toString() + '_' + j.toString()}
                      className="word"
                      onClick={getOnWordClick(i, j)}
                    >
                      {sentenceWord.word}
                    </span>);
                    toRender.push(<span>{sentenceWord.specials}</span>)
                  }
                  toRender.push(<>{" "}</>)
                  // toRender.push(<br/>);

                  return toRender;
                })}
                <br/>
              </>
            })
          }
        </div>
      </div>
      <div className="column">
        <h2></h2>
        <button onClick={onCopyClick}>Copy</button>
        <button onClick={onExportClick}>Export</button>
        <div className="word-box">
          <table style={{ textAlign: "start" }}>
            {wordList.map((x, i) => {
              const itemProps =
                i == wordList.length - 1 ? { ref: lastAddedWordRef } : {};
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
