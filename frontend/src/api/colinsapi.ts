const baseUrl = "https://www.collinsdictionary.com/dictionary/french-english";

function html(text: string): Document {
  const parser = new DOMParser();
  return parser.parseFromString(text, "text/html");
}

function body(doc: Document): Element {
  const body = doc.body;
  console.log(body);
  const found = body.querySelectorAll(".dictionaries .dictionary");
  console.log(found.length, found);

  const entry = found[0];

  const res = document.createElement("div");
  const table = document.createElement("table");
  table.className = "dictionary-table";

  function addValue(header: string, value: Node) {
    const tr = table.insertRow();
    tr.insertCell().appendChild(document.createTextNode(header + ":"));
    tr.insertCell().appendChild(value);
  }

  const title = entry.querySelector(".h2_entry");
  addValue("Title", title as Node);

  const hom = entry.querySelector(".hom");
  const grammarRole = hom?.querySelector(".gramGrp");
  grammarRole && addValue("PartOfSpeech", grammarRole);

  const sense = hom?.querySelector(".sense");
  if (sense) {
    const meaning = sense.querySelector(":scope > .cit.type-translation");
    addValue("Meaning", meaning as Node);

    const examples = sense.querySelectorAll(".cit.type-example");
    const examplesDiv = document.createElement("div");
    examples.forEach((el) => {
      examplesDiv.append(el);
    });
    addValue("Examples", examplesDiv);
  }

  //   res.appendChild(hom as Node);
  //   res.appendChild(example as Node);

  res.appendChild(table);
  return res;
}

export function lookUp(word: string, callback: (val: Element) => void) {
  //   word = "été";
  console.log("trying to lookup", word);

  const url = `${baseUrl}/${word}`;
  fetch(url)
    .then((r) => r.text())
    .then(html)
    .then(body)
    .then(callback);
}
