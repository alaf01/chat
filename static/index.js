document.addEventListener('DOMContentLoaded', () => {
  //cannot submit just after page loading- the form is empty
    document.getElementById('submit').disabled = true;
    //unables the form, when the kay was pressed and input is not empty
                  document.querySelector('#message').onkeyup = () => {
                    if (document.querySelector('#message').value.length > 0)
                        document.querySelector('#submit').disabled = false;
                    else
                        document.querySelector('#submit').disabled = true;
                  };
    // Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    // When connected, configure buttons
    socket.on('connect', () => {
      document.getElementById('myform').onsubmit =  () => {

        socket.emit('submit message', document.getElementById('message').value);
        document.getElementById('message').value = ''
        //disable submit button
        document.getElementById('submit').disabled = true;
        return false;
    };

  });

    // When a new vote is announced, add to the unordered list
    socket.on('send message', data => {
        document.querySelector('#chat').innerHTML += ("<br>" + localStorage.getItem("login") + ": "+ data);

    });
});
