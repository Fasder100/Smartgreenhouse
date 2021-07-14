import  io  from 'socket.io-client/socket.io';

const URL = "http://localhost:5000/";
const socket = io(URL);

socket.on('connect', () => {
    console.log("Connected with id: "+ socket.id)
});

// socket.on('sendTemp', function(msg) {
//     var item = document.createElement('h2');
//     item.textContent = msg;
//     messages.appendChild(item);
//     //window.scrollTo(0, document.body.scrollHeight);
//   });

export default socket;