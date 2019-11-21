import os
import requests
from flask import Flask, render_template, session, request, url_for, escape, redirect, jsonify
from flask_socketio import SocketIO, emit,join_room, leave_room

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

rooms = ["chanel1", "chanel2"]
users=["Ala", "Doma", "Mysia"]
whoisin={'room1':['Ala','Ola','Kasia'], 'room2':['Wojtus', 'Domka', 'Rysiek'], 'room3':[],'myroom':[]}
whoiswhere={"Ala":"room1"}
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
    del whoiswhere[session.get("username")]
    if not session.get("username") is None:
        users.remove(str(session['username']))
    else:
        session.pop("username", None)
    session.pop("username", None)

    return render_template("index.html")

@app.route("/general")
def general():
    return redirect(url_for('index'))

@app.route("/room_list")
def room_list():
    active=[]
    for user, room in whoiswhere.items():
        active.append(room)

    return render_template("room_list.html", rooms=rooms, active=active )
#it takes the data from jv socket "submit message" sent by js file and send it back to js naming "send message". Data is default name for second argument of emit
@socketio.on("submit message")
def message(message):
    emit("send message", {'data': message['data']}, broadcast = True)

@socketio.on('my_event', namespace='/test')
def test_message(message):
    emit('my_response',
         {'data': message['data']})

@socketio.on('join')
def join(room):
    join_room(room['room'])
    whoiswhere[session.get("username")]=room['room']
    rooms.append(room['room'])
    emit('my_response',
         {'data': 'User: '+session.get("username")+'  has entered the room',
         'room': room['room']})


@socketio.on('send_to_room')
def send_to_room(data):
    rooms.append(data['room'])

    emit('chat_in_room',
        {'message': data['message'],'user': session.get("username"),
        'room': data['room']}, room=data['room'])
'''
etio.on('my_room_event', namespace='/test')
def send_room_message(message):
    session['receive_count'] = session.get('receive_count', 0) + 1
    emit('my_response',
         {'data': message['data'], 'count': session['receive_count']},
         room=message['room'])

@socketio.on('my_event', namespace='/test')
def test_message(message):
    emit('my_response',{'data': message['data']})


@socketio.on('leave')
def on_leave(data):
    username = data['username']
    room = data['room']
    leave_room(room)
    send(username + ' has left the room.', room=room)
'''

if __name__ == "__main__":
    app.secret_key = os.urandom(12)
    socketio.run(app, debug=True, host='0.0.0.0', port=5000)
