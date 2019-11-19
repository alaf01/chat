
            document.addEventListener('DOMContentLoaded', () => {


              document.getElementById('submit').disabled = true;

              document.querySelector('#message').onkeyup = () => {
                if (document.querySelector('#message').value.length > 0)
                    document.querySelector('#submit').disabled = false;
                else
                    document.querySelector('#submit').disabled = true;
              };

               document.querySelector('#add-message').onsubmit = () => {

                    // Create new item for list
                    const li = document.createElement('li');
                    li.innerHTML =( localStorage.getItem("login") + ": njkdsfjkdsh " + document.querySelector('#message').value);

                    // Add new item to task list
                    document.querySelector('#chat').append(li);

                    // Clear input field
                    document.querySelector('#message').value = '';


                    document.getElementById('submit').disabled = true;
                    // Stop form from submitting
                    return false;
                };
            });//
