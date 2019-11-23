import os
import requests
from datetime import datetime
from flask import Flask, render_template, session, request, url_for, escape, redirect, jsonify
from flask_socketio import SocketIO, emit,join_room, leave_room


app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

rooms = ["chanel1", "chanel2"]
users=["Ala", "Doma", "Mysia"]
whoisin={'room1':['Ala','Ola','Kasia'], 'room2':['Wojtus', 'Domka', 'Rysiek'], 'room3':[],'myroom':[]}
whoiswhere={"Ala":"room1","Doma":"chanel1", "Mysia":"chanel2",'Wojtus':"room1", 'Domka':"room1", 'Rysiek':"chanel2"}
messages={'room1': ['message']}
general_mess=[]
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
    if session.get("username") is None:
        return render_template("error.html", message="log in to create a new room")
    else:
        return render_template("create_room.html", rooms = rooms, users = users)

@app.route("/logout")
def logout():
# if user is not logged, return error message
    if session.get("username") is None:
        return render_template("error.html", message='You are not logged in!')
# if logged
    else:
        # take the username from session and delete it form 'whoiswhere' dictionary, where all of active users are (with room no)
        username=str(session.get("username"))
        if username in whoiswhere:
            del whoiswhere[session.get("username")]
        # finish user session and go back to users
        session.pop("username", None)
        return render_template("index.html")


@app.route("/room_list")
def room_list():
    if session.get("username") is None:
        return render_template("index.html")
    active=[]
    for user, room in whoiswhere.items():
            if room not in active:
                active.append(room)

    return render_template("room_list.html", rooms=rooms, active=active )

####################-----------    SOCKETS     ----------------------#####################################3
#it takes the data from jv socket "submit message" sent by js file and send it back to js naming "send message". Data is default name for second argument of emit
@socketio.on("submit message")
def message(message):
    now=str(datetime.now())[:16]
    emit("send message", {'data': message['data'], 'time': now}, broadcast = True)


@socketio.on('join')
def join(room):
    for elem in whoiswhere.values():
        if elem==room['room']:
            emit('room_exists', {'message':'room already exists, join it!'})
    now=str(datetime.now())[:16]
    join_room(room['room'])
    whoiswhere[session.get("username")]=room['room']
    rooms.append(room['room'])
    emit('my_response',
         {'data': 'User: '+session.get("username")+'  has entered the room',  'time': now,
         'room': room['room']})

@socketio.on('join_existing')
def join_existing(room):
    now=str(datetime.now())[:16]
    join_room(room['room'])
    whoiswhere[session.get("username")]=room['room']
    rooms.append(room['room'])
    emit('my_response',
         {'data': 'User: '+session.get("username")+'  has entered the room: '+room['room'],
         'time': now,
         'user': session.get("username"),
         'room': room['room']}, room=room['room'])

@socketio.on('send_to_room')
def send_to_room(data):
    rooms.append(data['room'])
    now=str(datetime.now())[:16]
    emit('chat_in_room',
        {'message': data['message'],'user': session.get("username"), 'time': now,
        'room': data['room']}, room=data['room'])

@socketio.on('add_message')
def add_message(data):
    now=str(datetime.now())[:16]
    emit('chat_in_room',
        {'message': str(data['message']),'user': session.get("username"), 'time': now,
        'room': data['room']}, room=data['room'] )

if __name__ == "__main__":
    app.secret_key = os.urandom(12)
    socketio.run(app, debug=True, host='0.0.0.0', port=5000)
