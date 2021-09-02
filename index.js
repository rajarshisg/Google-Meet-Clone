const express = require('express'); //requiring express
const app = express(); //app has all the properties of express
const server = require('http').Server(app); //creting http server
const io = require('socket.io')(server); //socket runs on this server
const { v4: uuidv4 } = require('uuid'); //used to get unique room ids
const { ExpressPeerServer } = require('peer'); //WebRTC api for real time media communication
const PORT = process.env.PORT || 8000; //port on which server runs

const peerServer = ExpressPeerServer(server, {
    debug: true
});


app.use(express.static('./assets')); //setting up static path
app.set('view engine', 'ejs'); //setting up view engine
app.set('views', './views'); //setting up view path

//route for index
app.get('/', function (req, res) {
    return res.render('home');
})

//route for new meeting --> creates a new room
app.get('/room', function (req, res) {
    return res.redirect(`/room/${uuidv4()}`);
});

//route for opeining a specific room
app.get('/room/:room', function (req, res) {
    return res.render('room', { roomId: req.params.room });
})

//route for meeting ending
app.get('/end/:room', function (req, res) {
    return res.render('meeting_end', { roomId: req.params.room });
})

//socket handels users joining/leaving and messaging
io.on('connection', socket => {
    //request for joining room
    socket.on('join-room', (roomId, userId, userName) => {
        socket.join(roomId); //joining the mentioned room
        socket.broadcast.to(roomId).emit('user-connected', userId, userName);
        socket.on('send-message', (inputMsg, userName) => {
            io.to(roomId).emit('recieve-message', inputMsg, userName);
        })
        socket.on('disconnect', () => {
            socket.broadcast.to(roomId).emit('user-disconnected', userId, userName);
        })
    });
});

//running the server
server.listen(PORT, function (err) {
    if (err) {
        console.log(`Error :: ${err} occured while starting the server in index.js!`);
    }
    console.log(`Server is up and running on port ${PORT}`);
});