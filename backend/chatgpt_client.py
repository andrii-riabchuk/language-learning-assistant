from openai import OpenAI
from priming import Role, create_message, request_entry, get_priming_messages
import env

import json
from types import SimpleNamespace

MODEL="gpt-3.5-turbo"

class ChatGPTClient:
    def __init__(self) -> None:
        self.client = OpenAI()
    
    def requestDefinitions(self, words):
        messages = get_priming_messages()

        list(map(lambda wc: request_entry(wc[0], wc[1]), words))
        user_message = f'[{','.join(list(map(lambda wc: request_entry(wc[0], wc[1]), words)))}]'
        
        messages.append(create_message(Role.User, user_message))
        # print('trying to send such messages:')
        # for message in messages:
        #     print(message,type(message), end='\n\n')

        res = self.client.chat.completions.create(model=MODEL,messages=messages)
        print(f'{len(res.choices)} choice(s) - picking first')

        first = res.choices[0]
        data = first.message.content
        obj = json.loads(data, object_hook=lambda d: SimpleNamespace(**d))
        
        return obj

