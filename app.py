#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from dotenv import load_dotenv
from pathlib import Path
from flask import Flask, request, render_template, jsonify
import json
import os
import sys
import time
from mistralai import Mistral

# Charger les variables d'environnement depuis un fichier .env
project_folder = os.path.expanduser('~/Mistral-87')
load_dotenv(os.path.join(project_folder, '.env'))

# Accéder à la clé API depuis le fichier .env
api_key = os.getenv("API_KEY")

app = Flask(__name__)


@app.route('/', methods=['GET', 'POST'])
def chat():

	# Initialiser le client Mistral avec votre clé API
	client = Mistral(api_key=api_key)

	with open(os.path.join(project_folder, 'config.json')) as config_file:
		config = json.load(config_file)

	model = config['model']
	temperature = config['temperature']
	frequency = config['frequency_penalty']
	presence = config['presence_penalty']

	ip = request.remote_addr
	messages = []
	prompt = ""
	completion = ""
	total = ""
	created = ""
	date_message = ""

	if request.method == 'POST':
		user_input = request.form['user_input']
		messages.append({'sender': 'YOU', 'content': user_input})

		response = client.chat.complete(
			messages=[
	            {
	                "role": "system",
	                "content": (
	                    "Tu es un assistant serviable. Retourne un résumé structuré en HTML "
	                    "(avec si besoin <h3>, <h4>, <ul>, <li>, <p>). N'utilise pas de blocs "
	                    "(```html)."
	                ),
	            },
	            {"role": "user", "content": prompt},
	        ],
			model=model,
			temperature=temperature,
			frequency_penalty=frequency,
			presence_penalty=presence
		)

		prompt = response.usage.prompt_tokens
		completion = response.usage.completion_tokens
		total = response.usage.total_tokens
		date_message = response.created
		created = time.strftime("%a %b %d %H:%M:%S %Z %Y", time.localtime(date_message))
		response_message = response.choices[0].message.content

		messages.append({'sender': 'Mistral', 'content': response_message})
		
		return jsonify({'messages': messages, 'prompt': prompt, 'completion': completion, 'total': total, 'created': created})

	return render_template('chat.html', ip=ip, messages=messages, prompt=prompt, completion=completion, total=total, created=created, model=model, temperature=temperature, frequency=frequency, presence=presence)


@app.route('/update_json', methods=['POST'])
def update_json():
	# Récupérer les valeurs des curseurs
	model = request.form['model']
	temperature = float(request.form['temperature'])
	frequency_penalty = float(request.form['frequencyPenalty'])
	presence_penalty = float(request.form['presencePenalty'])

	# Créer un dictionnaire avec les nouvelles valeurs
	data = {
		'model': model,
		'temperature': temperature,
		'frequency_penalty': frequency_penalty,
		'presence_penalty': presence_penalty
	}

	# Écrire le dictionnaire dans le fichier JSON
	with open('config.json', 'w') as file:
		json.dump(data, file)

	# Répondre avec une confirmation
	response = {'status': 'success', 'message': 'Fichier JSON mis à jour avec succès'}
	return jsonify(response)


if __name__ == '__main__':
	app.run(debug=True)
