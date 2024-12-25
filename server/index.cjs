const express = require('express');
const app = express();
const cors = require('cors');
const http = require('http').Server(app);
const { Server } = require('socket.io');
require('dotenv').config({ path: '../.env' });

const PORT = 4000;

app.use(cors());
app.use(express.json());

const io = new Server(http, {
	cors: {
		origin: '*',
		methods: ['GET', 'POST'],
		credentials: true,
	},
});

let activeRooms = {};

const userAuthRouter = require('./routes/userAuth.cjs');
app.use('/api/users', userAuthRouter);
const friendshipRouter = require('./routes/friendRouter.cjs');
app.use('/api/friends', friendshipRouter);

io.on('connection', (socket) => {
	console.log(`${socket.id} user just connected!`);

	socket.on('checkRoom', (roomName, callback) => {
		const exists = activeRooms[roomName] !== undefined;
		callback(exists);
	});

	socket.on('createRoom', (roomName) => {
		activeRooms[roomName] = { users: [socket.id] };
		socket.join(roomName);
		console.log(`Room created: ${roomName}`);
	});

	socket.on('joinRoom', (roomName) => {
		if (activeRooms[roomName]) {
			// Join the room and add the user to the room's user list
			activeRooms[roomName].users.push(socket.id);
			socket.join(roomName);
			console.log(`User ${socket.id} joined room: ${roomName}`);
		} else {
			console.log(`Room ${roomName} does not exist.`);
		}
	});

	socket.on('sendMessage', (message) => {
		io.to(message.roomName).emit('message', message);
	});

	socket.on('disconnect', () => {
		console.log('🔥: A user disconnected');
	});
});

http.listen(PORT, '0.0.0.0', () => {
	console.log(`Server listening on http://192.168.1.28:${PORT}`);
});
