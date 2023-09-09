const socket = io()

let name;
let textarea = document.querySelector('#inp')
let msg_area = document.querySelector('.container')
let userName = document.querySelector('#userName')
let users = document.getElementById('tot_users')
do {
    name = prompt('Please enter your name: ')
} while (!name);
userName.innerHTML = `${name}`

textarea.addEventListener('keyup', (e) => {
    if (e.key == 'Enter') {
        sendMessage(e.target.value)
    }
})

function send() {
    sendMessage(textarea.value)
}
function names() {
    appendName(name)
    socket.emit('showName', name)
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
    socket.emit('message', msg)
}

function appendName(person) {
    let names = document.createElement('li')
    names.classList.add('user');
    names.innerHTML = `${person}`
    users.appendChild(names)

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

function update(activeUsers) {

    while (users.hasChildNodes()) {
        users.removeChild(users.firstChild);
    }

    for (let i = 0; i < activeUsers.length; i++) {
        let names = document.createElement('li')
        names.classList.add('user');
        names.innerHTML = `${activeUsers[i]}`;
        users.appendChild(names)
    }
    console.log(activeUsers)
}
function disconnectUser(user, activeUsers) {

    console.log(`${user} has left the chat`);
    delete activeUsers[user]; // Remove user from activeUsers
    update(activeUsers);
}

// Receive message
socket.on('showName', (activeUsers) => {
    update(activeUsers);
})
socket.on('message', (msg) => {
    appendMessage(msg, 'left')
    scrollToBottom()
})
socket.on('disconnected', (name, activeUsers) => {
    disconnectUser(name, activeUsers);
})


function scrollToBottom() {
    msg_area.scrollTop = msg_area.scrollHeight
}
