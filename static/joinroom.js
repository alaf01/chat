//run after a page is loadad
document.addEventListener('DOMContentLoaded', () => {

  //hide a chat log and a form to submit messages
  document.getElementById('room').style.display="none";
    document.getElementById('chatlog').style.display="none";
    //connect to socket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);
    //define a variable room
    var room
    //block the create form if empty
    document.getElementById('submit').disabled = true;
    document.querySelector('#create_room').onkeyup = () => {
      if (document.querySelector('#create_room').value.length > 0)
          document.querySelector('#submit').disabled = false;
      else
          document.querySelector('#submit').disabled = true;
    };
    //on submitting the form, save the value from form "create" to variable "room", reset form value and join by socket to room
    document.getElementById('create').onsubmit = () => {
        room = document.getElementById('create_room').value;
        document.getElementById('create_room').value=''
        socket.emit('join', {'room': room});
//take the socket message, if room already exists
        return false;
    };
    //take the response from server, change the title, hide "create" form and show chat log and submitting messages form
    //block submit button and anable it after pressing a key and if the length of text is not zero
    document.getElementById('inroom').disabled = true;
    document.querySelector('#message').onkeyup = () => {
      if (document.querySelector('#message').value.length > 0)
          document.querySelector('#inroom').disabled = false;
      else
          document.querySelector('#inroom').disabled = true;
    };

    socket.on('my_response', data => {
      document.getElementById('title').innerHTML="Start chat";
      document.getElementById('create').style.display="none";
      document.getElementById('room').style.display="block";
      document.getElementById('chatlog').style.display="block";
      //announce that the table was created and the user has joined it
      document.querySelector('#chat').innerHTML += '<br>'+ 'the room: \"' + data.room + '\" was created';
      document.querySelector('#chat').innerHTML += '<br>'+ data.data;

    });
//on submitting messages send it to the server, reset message form value and take and write response from server (message and room)
    document.getElementById('room').onsubmit = () => {
      socket.emit('send_to_room', {'message': document.getElementById('message').value, 'room': room});
      document.getElementById('message').value='';
      document.getElementById('inroom').disabled = true;
      return false;
    };
  //if the room exists, take a socket message from server, alert it and reload
    socket.on('room_exists', data => {
      alert(data.message);
      location.reload();
    })
    socket.on('chat_in_room', data => {
      document.querySelector('#chat').innerHTML += '<br>'+data.time+ ' '+data.user+': '+data.message;
    })
  })
