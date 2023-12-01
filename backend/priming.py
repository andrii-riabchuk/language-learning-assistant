
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
    response = '{"base": "courriel", "definition":"email", "pos":"noun", "gender":"m"}'
    return (request, response)

def example_verb():
    word, context = 'j’aimerais', 'J’aimerais aller en Écosse.'
    request = request_entry(word, context)
    response = '{"base": "aimer", "definition":"would like", "pos":"verb"}'
    return (request, response)

def example_preposition():
    word, context = 'sur', 'Pose-le sur la table'
    request = request_entry(word, context)
    response = '{"base": "sur", "definition":"on", "pos":"preposition"}'
    return (request, response)

def get_priming_messages():
    system = create_message(Role.System, """You act like a French dictionary API,
                            I give you list of entries in such format [word, sentence with this word for context]; 
        For each entry:
            - 'base': The base form of the word.
            - 'definition': The English translation or definition of the word.
            - 'pos': The part of speech
            - 'gender': Use 'm' for masculine, 'f' for feminine, or leave it empty if the gender is not specified.""")

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