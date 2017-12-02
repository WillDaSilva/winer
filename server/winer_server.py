from flask import Flask, url_for,render_template
app = Flask (__name__)

@app.route('/')
def memes():
    return render_template('chat.html')
