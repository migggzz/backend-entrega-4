const socket = io();
let user = '';
const now = new Date();
const timeString = now.toLocaleTimeString();

alert('hello world');

// socket.on('logs', data => {
//     console.log(data)
//     const divLog = document.getElementById('messageLogs');
//     let messages = '';
//     data.reverse().forEach(element => {
//         messages += `<p><i> ${element.user}</i>: ${timeString} : ${element.message}</p>`
//     });
//     divLog.innerHTML = messages
// })