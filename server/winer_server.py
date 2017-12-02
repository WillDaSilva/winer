import os
import json
import atexit
from datetime import datetime

import logging
from logging.handlers import RotatingFileHandler

from flask import Flask, url_for, render_template
from flask_socketio import SocketIO, emit
app = Flask (__name__)
logHandler = RotatingFileHandler('winer.log', maxBytes=10000, backupCount=1)
logHandler.setLevel(logging.INFO)
app.logger.addHandler(logHandler)
chat_log = []
socketio = SocketIO(app)

@app.route('/')
def render_chat_page():
    load_chat_log()
    return render_template('chat.html')

@socketio.on('message')
def handle_message(message):
    message = json.loads(message)

    logMessage(message.body)
    emit('message',message,broadcast=True)

@socketio.on('connect')
def handle_connect():
    emit('message', json.dumps({'history': chat_log[:3]}), broadcast=False )


def load_chat_log():
    with open('chat_log.json', 'r') as chat_log_file:
        chat_log = json.load(chat_log_file)
        # chat_log is a list containing chat message objects
        # chat message objects example:
        #   {
        #       timestamp: '2017-12-02 13:27:57.288789',
        #       body: 'example message body text',
        #       alias: 'example_alias'
        #   }

def save_chat_log():
    with open('chat_log.json', 'w') as chat_log_file:
        json.dump(chat_log_file)


def logMessage(
            body: str,
            timestamp: str = str(datetime.now()),
            alias:str = ''):
    # body is the body of the message
    # timestamp is the time the message was sent
    #   defaults to time the function was called if time the message was sent
    #   was not provided
    # alias is the name the client chose for themselves
    #   default to no alias
    chat_log.append({'body': body, 'timestamp': timestamp, 'alias': alias})



def cleanup():
    save_chat_log()

atexit.register(cleanup)

if __name__ == '__main__':
    socketio.run(app)
