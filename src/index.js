const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const { generateMessage, generateLocation } = require('./utils/messages')
const {getUser,getUserRoom,addUser,removeUser} = require("./utils/user")

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

io.on('connection', (socket) => {
    console.log('New WebSocket connection')

    socket.on('join',({username,room},callback)=>{
       const {error,user} = addUser({id:socket.id,username,room})
        if(error){
           return callback(error)
        }
        socket.join(user.room)
        socket.emit('message', generateMessage("Admin",'Welcome!'))
        socket.broadcast.to(user.room).emit('message', generateMessage("Admin",`${user.username} has joined!`))
        io.to(user.room).emit("roomData",{
            room:user.room,
            users:getUserRoom(user.room)
        })
        callback()
    })
    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id)
        if(!user){
            return
        }
        io.to(user.room).emit('message', generateMessage(user.username,message))
        callback()
    })

    socket.on('sendLocation', (coords, callback) => {
        const user = getUser(socket.id)

        io.to(user.room).emit('locationMessage', generateLocation(user.username,coords))
        callback()
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)
        if(user) {
            io.to(user.room).emit('message', generateMessage("Admin",`${user.username} has left!`))

        io.to(user.room).emit("roomData",{
            room:user.room,
            users:getUserRoom(user.room)
        })
            }
    })
})

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})
