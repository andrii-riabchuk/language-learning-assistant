import { DictionaryEntry } from '../../api/types';
import './WordBox.css'

function decodeGender(str?: string) {
    const masculine = 'masculine'
    const feminine = 'feminine'

    if (str == 'm' || str == masculine) return masculine
    if (str == 'f' || str == feminine) return feminine

    return "_"
}

export function WordBox(props: { entry: DictionaryEntry }) {
    // const entry = { word: "word", base: "base", gender: "masculine", definition: "definition", pos: "noun" };
    // Object.assign(props, { entry: entry });

    const entry = props.entry;

    // props.entry.gender = "feminine";

    return <div className="entry-box">
        <div className="gender">
            <span>[{decodeGender(entry.gender)}]</span>
        </div><br />

        <p><span className="wordbox-word">{entry.word}<sub>{entry.pos}</sub></span></p>
        <p><span className="property">Base:</span> {entry.base}</p>
        <p><span className="property">Definition:</span> {entry.definition}</p>
    </div >;
}

export default WordBox;