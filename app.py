from flask import Flask, request, jsonify
import requests
import json
from datetime import datetime, timedelta

app = Flask(__name__)

API_KEY = 'akumabot'
WPP_API_URL = 'http://localhost:3000'
data_atual = datetime.today()
dia_amanha_str = data_atual + timedelta(1)
dia_amanha = dia_amanha_str.date()

with open('comandos.json', 'r') as jsonread:
    comando = json.load(jsonread)

@app.route('/webhook', methods=['POST'])
def webhook():
    message = request.json
    chat_id = message['messages'][0]['from']
    text = message['messages'][0]['body']

    # Aqui você pode definir a lógica para responder à mensagem recebida
    response_text = f'Você disse: {text}'

    # Enviar a resposta de volta ao usuário
    data = {
        'phone': chat_id,
        'body': response_text
    }

    response = requests.post(
        f"{WPP_API_URL}/send-message",
        headers={
            "x-api-key": API_KEY,
            "Content-Type": "application/json"
        },
        data=json.dumps(data)
    )

    return jsonify({'status': 'success'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
