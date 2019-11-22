document.addEventListener('DOMContentLoaded', () => {
  var room;
  var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

  document.getElementById('hide').style.display="none";

  document.getElementById('form').onsubmit = () =>{
    return false;
    document.getElementById('hide').style.display="block";
    room =  document.getElementById('room_list').value
    socket.emit('join_existing', {'room': document.getElementById('room_list').value});
    socket.on('my_response', data => {
      document.getElementById('message').value='';
      document.getElementById('hide_after_socket').style.display="none";
      document.getElementById('chat_room').innerHTML= data.room;
      document.querySelector('#chat').innerHTML += '<br>'+ data.data;

  });
    return false;};
  document.getElementById('add-message').onsubmit = () =>{
    socket.emit('send_to_room', {'message': document.getElementById('message').value, 'room': room});
    document.getElementById('message').value='';
    document.getElementById('submit').disabled = true;
    return false;
  };


      //  document.getElementById('create').style.display="none";
    //    document.getElementById('hide').style.display="block";
      //  document.getElementById('chatlog').style.display="block";
        //announce that the table was created and the user has joined it
      //  document.querySelector('#chat').innerHTML += '<br>'+ 'the room: \"' + data.room + '\" was created';
      //  document.querySelector('#chat').innerHTML += '<br>'+ data.data;

//      });
  //on submitting messages send it to the server, reset message form value and take and write response from server (message and room)
      //document.getElementById('room').onsubmit = () => {
      //  socket.emit('send_to_room', {'message': document.getElementById('message').value, 'room': room});
      //  document.getElementById('message').value='';
      //  document.getElementById('inroom').disabled = true;
    //    return false;
    //  };
  //socket.emit('send_to_room', {'message': document.getElementById('message').value, 'room': document.getElementById('create_room').value});
  //document.getElementById('message').value='';
  //socket.on('chat_in_room', data => {
  //  document.querySelector('#chat').innerHTML += '<br>'+data.user+': '+data.message;
//  })
})
