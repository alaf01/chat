document.addEventListener('DOMContentLoaded', () => {
  var room;
  var login;
  var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);
  //disable submit button
    document.getElementById('submit').disabled = true;
    //unables the form, when the kay was pressed and input is not empty
                  document.querySelector('#message').onkeyup = () => {
                    if (document.querySelector('#message').value.length > 0)
                        document.querySelector('#submit').disabled = false;
                    else
                        document.querySelector('#submit').disabled = true;
                  };

  document.getElementById('hide').style.display="none";

  document.getElementById('form').onsubmit = () =>{
    room = document.getElementById('room_list').value;
    document.getElementById('hide').style.display="block";
    document.getElementById('hide_after_socket').style.display="none";
    socket.emit('join_existing', {'room': room});
    return false;
  };
  socket.on('my_response', data => {
    document.getElementById('message').value='';
    document.getElementById('chat_room').innerHTML= data.room;
    document.getElementById('chat_log').innerHTML += '<br>'+ data.data;

                                    });
    document.getElementById('add-msg').onsubmit = () =>{

    socket.emit("add_message", {'message': document.getElementById('message').value, 'room':room})
    document.getElementById('message').value='';
    document.getElementById('submit').disabled = true;
    return false;
  };
    socket.on('chat_in_room', data => {
      document.getElementById('chat_log').innerHTML += '<br>'+data.time+ ' ' +data.user+': '
      document.getElementById('chat_log').innerHTML += data.message;
                                      })
});
