class Role:
    System = 'system'
    User = 'user'
    Assistant = 'assistant'


def create_message(role, content):
    return {"role": role, "content": content}

def request_entry(word, context):
    return [word, context].__str__()

def example_noun():
    word, context = 'courriel', 'Courriel pour des renseignements'
    request = request_entry(word, context)
    response = '{"word": "courriel", "base": "courriel", "definition":"email", "pos":"noun", "gender":"m"}'
    return (request, response)

def example_verb():
    word, context = 'j’aimerais', 'J’aimerais aller en Écosse.'
    request = request_entry(word, context)
    response = '{"word": "j’aimerais", "base": "aimer", "definition":"would like", "pos":"verb"}'
    return (request, response)

def example_preposition():
    word, context = 'sur', 'Pose-le sur la table'
    request = request_entry(word, context)
    response = '{"word": "sur", "base": "sur", "definition":"on", "pos":"preposition"}'
    return (request, response)

def get_priming_messages():
    system = create_message(Role.System,
                            """As a French dictionary API:
1) Receive entries in the format {'word': 'example', 'context': 'Example sentence'}.
2) If requested N entries, ensure N responses, each corresponding to a given query entry 'word' field.
3) Exclude responses unrelated to the specified 'word' field.
4) If no answers are available, provide an empty object - {}.
For each entry:
- 'word': exact requested word from request, just for correct identifying
- 'base': Base form of the word.
- 'definition': English translation or definition.
- 'pos': Part of speech.
- 'gender': Use 'm' for masculine, 'f' for feminine, or leave it empty if gender is unspecified.""")

    requests, responses = [], []
    for example in [example_noun(), example_verb(), example_preposition()]:
        request, response = example
        requests.append(request)
        responses.append(response)
    
    user_message = f'[{','.join(requests)}]'
    user = create_message(Role.User, user_message)

    assistant_message = f'[{','.join(responses)}]'
    assistant = create_message(Role.Assistant, assistant_message)

    return [system, user, assistant]