document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('room').style.display="none";
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);
    var room = document.getElementById('create_room').value;

    document.getElementById('create').onsubmit = () => {
      //  document.getElementById('chat').innerHTML += document.getElementById('room').value;

        socket.emit('join', {'room': document.getElementById('create_room').value});
        return false;
    };
    socket.on('my_response', data => {
      document.getElementById('title').innerHTML="Start chat";
      document.getElementById('create').style.display="none";
      document.getElementById('room').style.display="block";
      document.querySelector('#chat').innerHTML += '<br>'+ 'the room: \"' + data.room + '\" was created';
      document.querySelector('#chat').innerHTML += '<br>'+ data.data;

    });

    document.getElementById('room').onsubmit = () => {
      socket.emit('send_to_room', {'message': document.getElementById('message').value, 'room': room});
      document.getElementById('message').value='';
      return false;
    };

    socket.on('chat_in_room', data => {
      document.querySelector('#chat').innerHTML += data.message ;
    })
  })
