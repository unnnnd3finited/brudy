from flask import Flask, render_template, send_from_directory

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/songs/<path:filename>')
def serve_song(filename):
    return send_from_directory('static/songs', filename)

@app.route('/gifs/<path:filename>')
def serve_gif(filename):
    return send_from_directory('static/gifs', filename)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=81)
