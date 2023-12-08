import React, { useEffect, useRef, useState } from "react";
import { toClip, toCsv } from "../utils/export";
import { compareIgnoreCase, strIndex } from "../utils/string";

import CrossButton from "../ui/CrossButton/CrossButton";
import { SentenceWord, clean, extractSentencesLines, getWordContext } from "../utils/language";
import { Dictionary } from "../api/dictionary";
import WordBox from "./WordBox/WordBox";
import { DictionaryEntry, Loadable } from "../api/types";
import Loader from "../ui/CrossButton/Loader/Loader";

import "./LanguageAssistant.css";

export interface LanguageAssistantProps {
  forText: string;
}

export interface Definition {
  word: string;
  meanings: string[][];
}

const dictionary = new Dictionary();
const delayedTasks: { [key: string]: number } = {};

export default function LanguageAssistant({ forText }: LanguageAssistantProps) {
  const text = extractSentencesLines(clean(forText));

  const [selectedWords, setSelectedWords] = useState<SentenceWord[]>([]);
  const checkSelected = useRef<{ [key: string]: boolean }>({});
  const checkMap = checkSelected.current;

  const wordList = selectedWords.map(sw => sw.word);

  const lastAddedWordRef = useRef<HTMLTableRowElement>(null);

  const addSelectedWord = (sWord: SentenceWord) => {
    if (!selectedWords.find((x) => compareIgnoreCase(x.word, sWord.word))) {
      setSelectedWords([...selectedWords, sWord]);
    }
  };

  useEffect(() => {
    lastAddedWordRef.current?.scrollIntoView();
  }, [selectedWords]);

  const [definition, setDefinition] = useState<Loadable<DictionaryEntry>>();
  function lookUpDefinitions() {
    const wordsWithContext = selectedWords.map(sw => {
      const context = getWordContext(text, sw);
      return { word: sw.word, context }
    });
    const wordIndeces = selectedWords.map(sw => strIndex(sw.lineId, sw.wordId));

    setDefinition({ ...definition, isLoaded: false });
    dictionary.loadDefinitions(wordsWithContext).then(() => {
      console.log("definitions loaded");
      wordIndeces.forEach(ij_str => checkMap[ij_str] = true);
      setDefinition({ ...definition, isLoaded: true });
      if (!definition?.value) {
        onWordListItemClick(wordList[0]);
      }
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getOnWordClick = (lineId: number, wordId: number): (e: any) => void => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return (e: React.MouseEvent<HTMLSpanElement>) => {
      const sentenceWord = text.lines[lineId].words[wordId];
      addSelectedWord(sentenceWord);
    };
  }

  const onCrossClick = (i: number) => {
    function f() {
      const word = selectedWords[i];
      setSelectedWords(selectedWords.toSpliced(i, 1));
      checkMap[strIndex(word.lineId, word.wordId)] = false;
    }
    return f;
  };

  const onCopyClick = () => toClip(wordList);
  const onExportClick = () => toCsv(wordList);

  // temporary
  const onWordListItemClick = (word: string) => {
    console.log("wordList item click", event);
    console.log("going to lookup dictionary with word: ", word);
    const lll = dictionary.get(word);
    setDefinition({ isLoaded: definition?.isLoaded ?? true, value: lll });
    console.log("result: ", lll);
  }

  const showLoader = definition && !definition.isLoaded;
  console.log('definition- ', definition);
  console.log('showLoader -', showLoader);

  const getOnWordMouseHover = (sw: SentenceWord): () => void => {
    return () => {
      console.log("you won't believe how often this method fire");
      const ij = strIndex(sw.lineId, sw.wordId);
      if (!checkMap[ij]) return;

      // onWordListItemClick(sw.word);
      delayedTasks[ij] = window.setTimeout(() => {
        onWordListItemClick(sw.word);
      }, 500);
    }
  }
  const getOnMouseLeave = (sw: SentenceWord): () => void => {
    return () => {
      const ij = strIndex(sw.lineId, sw.wordId);
      if (!checkMap[ij]) return;

      clearTimeout(delayedTasks[ij]);
    }
  }
  //
  return (
    <>
      <div className="column main">
        <h2>🤗🤗🤗
          <div className="lookup-header">
            <button className="lookup-button" onClick={lookUpDefinitions}>Lookup</button> {showLoader ? <Loader /> : null}
          </div>
        </h2>
        <div className="textContainer">
          {
            text.lines.map((line, i) => {
              if (line.IsEmpty) return <br />;
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
                      onMouseOver={getOnWordMouseHover(sentenceWord)}
                      onMouseLeave={getOnMouseLeave(sentenceWord)}
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
                <br />
              </>
            })
          }
        </div>
        <div className="lookup-column">
          <h2></h2>
          {(() => {
            console.log("inside lookup body, again", definition);
            if (!definition || !definition.value) return null;

            return <WordBox entry={definition.value!} />
          })()}
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
                  <td style={{ width: "150px" }} onClick={() => { onWordListItemClick(x) }}>
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
    </>
  );
}
