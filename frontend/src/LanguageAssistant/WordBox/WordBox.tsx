import { DictionaryEntry } from '../../api/types';
import { getCollinsLink, getGoogleLink } from '../../utils/external';

import './WordBox.css'

function decodeGender(str?: string) {
    const masculine = 'masculine'
    const feminine = 'feminine'

    if (str == 'm' || str == masculine) return masculine
    if (str == 'f' || str == feminine) return feminine

    return "_"
}

export function WordBox(props: { entry: DictionaryEntry }) {
    const entry = props.entry;

    return <div className="entry-box">
        <div className="gender">
            <span>[{decodeGender(entry.gender)}]</span>
        </div><br />

        <p><span className="wordbox-word">{entry.word}<sub>{entry.pos}</sub></span></p>
        <p><span className="property">Base:</span> {entry.base}</p>
        <p><span className="property">Definition:</span> {entry.definition}</p>
        <div className='footer'>
            <a onClick={() => window.open(getCollinsLink(entry.word), 'popup', 'width=600,height=600')}>Collins </a>
            <a href={getGoogleLink(entry.word)} target='_blank'>Google</a>
        </div>
    </div>;
}

export default WordBox;