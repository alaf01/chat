
//function run when the page is loaded
            document.addEventListener('DOMContentLoaded', () => {
// SOCKET ______Connect to websocket
              var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);
//cannot submit just after page loading- the form is empty
              document.getElementById('submit').disabled = true;
//unables the form, when the kay was pressed and input is not empty
              document.querySelector('#message').onkeyup = () => {
                if (document.querySelector('#message').value.length > 0)
                    document.querySelector('#submit').disabled = false;
                else
                    document.querySelector('#submit').disabled = true;
              };
//action run after submitting the form (clicking submit button)
               document.querySelector('#add-message').onsubmit = () => {

                    //Take the user name from local storage- users are not secured by password, no fragile data so no security concerns
              //      li.innerHTML =( localStorage.getItem("login") + ": " +document.querySelector('#message').value);

                    // Add new item to task list
            //        document.querySelector('#chat').append(li);

                    // SOCKET ______socket- emition to flask
                    socket.emit('submit message', document.getElementById('message').value);
                    socket.on('send message', data => {
                        const li = document.createElement('li');
                        // Create new item for list
                        li.innerHTML =(localStorage.getItem("login") + ": "+ data);
                    // Add new item to task list
                        document.querySelector('#chat').append(li);
                    // Clear input field
                    document.querySelector('#message').value = '';
                    //disable submit button
                    document.getElementById('submit').disabled = true;
                    // Stop form from submitting
                    return false;
                };
                // When a new vote is announced, add to the unordered list


                });
            });//
