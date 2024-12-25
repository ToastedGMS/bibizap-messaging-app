const prisma = require('../prisma/client.cjs');
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

	socket.on(
		'sendMessage',
		async ({ textContent, authorId, recipientId, chatId }) => {
			const authorIdInt = parseInt(authorId, 10);
			const recipientIdInt = parseInt(recipientId, 10);

			let chat = await prisma.chat.findUnique({
				where: { id: chatId },
			});

			if (!chat) {
				try {
					chat = await prisma.chat.create({
						data: {
							id: chatId,
							isGroup: false,
							members: {
								create: [
									{ user: { connect: { id: authorIdInt } } },
									{ user: { connect: { id: recipientIdInt } } },
								],
							},
						},
					});
				} catch (error) {
					console.error('Error creating chat:', error);
					return;
				}
			}

			try {
				const newMessage = await prisma.message.create({
					data: {
						textContent,
						authorId: authorIdInt,
						recipientId: recipientIdInt,
						chatId: chat.id,
						createdAt: new Date(),
					},
				});

				// Fetch usernames
				const [author, recipient] = await Promise.all([
					prisma.user.findUnique({ where: { id: authorIdInt } }),
					prisma.user.findUnique({ where: { id: recipientIdInt } }),
				]);

				const messageWithUsernames = {
					...newMessage,
					authorName: author.username,
					recipientName: recipient.username,
				};

				// Emit the new message with usernames to the chat room
				io.to(chat.id).emit('message', messageWithUsernames);
			} catch (error) {
				console.error('Error creating message:', error);
			}
		}
	);

	socket.on('joinRoom', async (roomName) => {
		try {
			const chat = await prisma.chat.findUnique({
				where: { id: roomName },
				include: {
					messages: {
						orderBy: { createdAt: 'asc' },
					},
				},
			});

			socket.emit('roomMessages', chat.messages);
			socket.join(roomName);
		} catch (error) {
			console.error('Error fetching messages for room:', error);
		}
	});

	socket.on('disconnect', () => {
		console.log('🔥: A user disconnected');
	});
});

http.listen(PORT, '0.0.0.0', () => {
	console.log(`Server listening on http://192.168.1.28:${PORT}`);
});
