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
	},
});

const userAuthRouter = require('./routes/userAuth.cjs');
app.use('/api/users', userAuthRouter);

io.on('connection', (socket) => {
	console.log(`⚡: ${socket.id} user just connected!`);

	socket.on('disconnect', () => {
		console.log('🔥: A user disconnected');
	});
});

http.listen(PORT, () => {
	console.log(`Server listening on http://localhost:${PORT}`);
});
