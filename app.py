import os
import requests
from flask import Flask, render_template, session, request, url_for, escape, redirect, jsonify
from flask_socketio import SocketIO, emit,join_room, leave_room

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

rooms = ["chanel1", "chanel2"]
users=["Ala", "Doma", "Mysia"]

@app.route("/")
def index():
    if not session.get("username") is None:
        return render_template('general.html', login=session['username'])
    else:
        return render_template("index.html")

@app.route('/login', methods = ['GET', 'POST'])
def login():
   if request.method == 'POST':
      session['username'] = request.form.get('username')
      users.append(session['username'])
      return redirect(url_for('index'))
   if session.get("username") is None:
       return render_template("login.html")
   else:
       return redirect(url_for('index'))

@app.route('/create_room')
def new_room():
    return render_template("create_room.html", rooms = rooms, users = users)

@app.route("/logout")
def logout():
    if not session.get("username") is None:
        users.remove(str(session['username']))
    else:
        session.pop("username", None)
    session.pop("username", None)
    return render_template("index.html")

@app.route("/general")
def general():
    return redirect(url_for('index'))

#it takes the data from jv socket "submit message" sent by js file and send it back to js naming "send message". Data is default name for second argument of emit
@socketio.on("submit message")
def message(message):
    emit("send message", {'data': message['data']}, broadcast = True)

@socketio.on('my_event', namespace='/test')
def test_message(message):
    emit('my_response',
         {'data': message['data']})
'''
@socketio.on('my_event', namespace='/test')
def test_message(message):
    emit('my_response',{'data': message['data']})

@socketio.on('join')
def on_join(data):
    username = data['username']
    room = data['room']
    join_room(room)
    send(username + ' has entered the room.', room=room)

@socketio.on('leave')
def on_leave(data):
    username = data['username']
    room = data['room']
    leave_room(room)
    send(username + ' has left the room.', room=room)
'''

if __name__ == "__main__":
    app.secret_key = os.urandom(12)
    socketio.run(app, debug=True)
    app.run(debug=True, host='0.0.0.0', port=5000)
