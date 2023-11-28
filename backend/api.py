from urllib import response
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import http.client
import json 
import urllib.parse

from types import SimpleNamespace
from typing import Union

app = FastAPI()

origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"])

@app.get("/definition/{word}")
def read_item(word: str):
    res = request_word(word)
    if not res: return {}
    return res[0]


def request_word(word):
    conn = http.client.HTTPSConnection("lexicala1.p.rapidapi.com")

    headers = {
        'X-RapidAPI-Key': "",
        'X-RapidAPI-Host': "lexicala1.p.rapidapi.com"
    }

    text = urllib.parse.quote_plus(word)
    conn.request("GET", f"/search-entries?text={text}&language=fr", headers=headers)

    res = conn.getresponse()
    data = res.read()
    obj = json.loads(data, object_hook=lambda d: SimpleNamespace(**d))
    resultsList = []
    for result in obj.results:
        headword = result.headword
        
        word = headword.text
        pronunciation = (headword.pronunciation or None) and headword.pronunciation.value
        pos = headword.pos
        gender = (hasattr(headword, 'gender') or None) and headword.gender
        meanings = []
        for senseEntry in result.senses:
            translation_en = senseEntry.translations.en
            if not translation_en: continue
            if isinstance(translation_en, list):
                meanings.append([x.text for x in translation_en])
            else:
                meanings.append([translation_en.text])
        response_obj = {'word': word, 'pronunciation': pronunciation, 'pos': pos, 'gender': gender, 'meanings': meanings}

        resultsList.append(response_obj)
    
    return resultsList


# request_word("ménage")