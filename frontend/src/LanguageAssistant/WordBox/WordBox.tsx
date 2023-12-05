import { DictionaryEntry } from '../../api/types';
import './WordBox.css'


export function WordBox(props: { entry: DictionaryEntry }) {
    // const entry = { word: "word", base: "base", gender: "masculine", definition: "definition", pos: "noun" };
    // Object.assign(props, { entry: entry });

    const entry = props.entry;

    // props.entry.gender = "feminine";

    return <div className="entry-box">
        {entry?.gender ?
            (<><div className="gender">
                <span>[masculine]</span>
            </div><br /></>)
            : null}
        <p><span className="wordbox-word">{entry.word}<sub>{entry.pos}</sub></span></p>
        <p><span className="property">Base:</span> {entry.base}</p>
        <p><span className="property">Definition:</span> {entry.definition}</p>
    </div >;
}

export default WordBox;