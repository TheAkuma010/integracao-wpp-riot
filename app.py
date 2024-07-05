import requests
import json
from datetime import datetime, timedelta
from flask import Flask, jsonify

app = Flask(__name__)

API_KEY = 'akumabot'
session_id = 'akumabot'
WPP_API_URL = 'http://localhost:3000'
data_atual = datetime.today()
dia_amanha_str = data_atual + timedelta(1)
dia_amanha = dia_amanha_str.date()

with open('comandos.json', 'r') as jsonread:
    comando = json.load(jsonread)

@app.route('/process_messages', methods=['POST'])
def process_messages():
    vermensagens = requests.post(WPP_API_URL + '/client/searchMessages/' + session_id, headers={"x-api-key":API_KEY}, data=comando.get("search", {}))
    vermensagensJSON = vermensagens.json()
    vermensagensDUMP = json.dumps(vermensagensJSON, indent=4)

    with open("IdsMensagens.json", "w") as outfile:
        outfile.write(vermensagensDUMP)

    with open('IdsMensagens.json', 'r') as file:
        IdMensagem = json.load(file)

    if 'messages' in IdMensagem and IdMensagem['messages']:
        id_chat = IdMensagem['messages'][0]['_data']['id']['remote']

        enviarmensagem = requests.post(WPP_API_URL + '/client/sendMessage/' + session_id, headers={"x-api-key":API_KEY}, data=comando.get("retorno", {}))
        visualizarmensagem = requests.post(WPP_API_URL + '/client/sendSeen/' + session_id, headers={"x-api-key":API_KEY}, data={'chatId': id_chat})

        return jsonify({
            'message': 'Messages processed successfully',
            'send_message_status': enviarmensagem.status_code,
            'seen_message_status': visualizarmensagem.status_code
        })
    else:
        return jsonify({'message': 'No messages found'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
