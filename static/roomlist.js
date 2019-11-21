document.addEventListener('DOMContentLoaded', () => {

  document.getElementById('hide').style.display="none";

  document.getElementById('room_list').onsubmit = () =>{
    document.getElementById('hide').style.display="block";
    socket.emit('join', {'room': document.getElementById('room_list').value});
    return false;
  }
  socket.emit('send_to_room', {'message': document.getElementById('message').value, 'room': document.getElementById('create_room').value});
  document.getElementById('message').value='';
  return false;
  socket.on('chat_in_room', data => {
    document.querySelector('#chat').innerHTML += '<br>'+data.user+': '+data.message;
  })
})
