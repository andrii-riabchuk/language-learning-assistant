from typing import List
from urllib import response
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from pydantic import BaseModel

from chatgpt_client import ChatGPTClient

app = FastAPI()
chatgpt = ChatGPTClient()

origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"])


class Entry(BaseModel):
    word: str
    context: str
    
@app.post("/definition")
def read_item(req: List[Entry]):
    res = chatgpt.requestDefinitions([[e.word, e.context] for e in req])
    return res
