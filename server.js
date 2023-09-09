const express = require('express')
const app = express()
const http = require('http').createServer(app)

const PORT = process.env.PORT || 3000

http.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})

app.use(express.static(__dirname + '/public'))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

// Socket

let activeUsers = {};
const io = require('socket.io')(http)

io.on('connection', (socket) => {

    console.log('connected', socket.id)

    socket.on('message', (msg) => {
        socket.broadcast.emit('message', msg)
    })

    socket.on('showName', (person) => {
        activeUsers[socket.id] = person;
        socket.userName = person;
        io.emit('showName', Object.values(activeUsers))
    })

    socket.on('disconnect', () => {
        let user = socket.userName;
        delete activeUsers[socket.id]
        socket.broadcast.emit('disconnected', user, Object.values(activeUsers));
    })


})
