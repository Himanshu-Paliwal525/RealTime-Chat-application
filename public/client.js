const socket = io()

let name;
let textarea = document.querySelector('#inp')
let msg_area = document.querySelector('.container')
// let send = document.querySelector('#send')

do {
    name = prompt('Please enter your name: ')
} while (!name);

textarea.addEventListener('keyup', (e) => {
    if (e.key == 'Enter') {
        sendMessage(e.target.value)
    }
})
function send(){
    sendMessage(textarea.value)
}

function sendMessage(message) {
    let msg = {
        user: name,
        message: message.trim()
    }
    // Append
    appendMessage(msg, 'right')
    textarea.value = ''
    scrollToBottom()

    //Send to server
    socket.emit('message',msg)
}

function appendMessage(msg, type) {
    let mainDiv = document.createElement('div')
    let className = type;
    mainDiv.classList.add(className, 'msg')

    let markup = `
    <h4>${msg.user}</h4>
    <p>${msg.message}</p>
    `
    mainDiv.innerHTML = markup
    msg_area.appendChild(mainDiv)
}

// Receive message

socket.on('message',(msg)=>{
    appendMessage(msg,'left')
    scrollToBottom()
})

function scrollToBottom(){
    msg_area.scrollTop = msg_area.scrollHeight
}