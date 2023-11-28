import http.client
import json 
import urllib.parse

from types import SimpleNamespace

def request_word(word):
    conn = http.client.HTTPSConnection("lexicala1.p.rapidapi.com")

    headers = {
        'X-RapidAPI-Key': "734089a04bmshe562790e1e5b070p128df7jsnc6234360c710",
        'X-RapidAPI-Host': "lexicala1.p.rapidapi.com"
    }

    text = urllib.parse.quote_plus(word)
    print(text)
    conn.request("GET", f"/search-entries?text={text}&language=fr", headers=headers)

    res = conn.getresponse()
    data = res.read()
    obj = json.loads(data, object_hook=lambda d: SimpleNamespace(**d))
    resultsList = []
    for result in obj.results:
        print(result)
        headword = result.headword
        pronunciation = headword.pronunciation
        pos = headword.pos
        gender = headword.gender
        senses = [sense.translations.en for sense in result.senses]
        resultsList.append((headword, pronunciation, pos, gender, senses))
    
    print(resultsList)
    return resultsList


request_word("ménage")