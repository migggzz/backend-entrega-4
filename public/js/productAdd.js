const socket = io();
let user = '';
const now = new Date();
const timeString = now.toLocaleTimeString();

alert('hello world');

socket.on('logs', data => {
    console.log(data)
    const divLog = document.getElementById('messageLogs');
    let messages = '';
    data.forEach(element => {
        messages += `<p>${element.title}</p>
                    <p>${element.price}</p>`
    });
    divLog.innerHTML = messages
})

doSubmit = (e) => {
    socket.emit('message', {user, message: e.target.value, timeString})
}
