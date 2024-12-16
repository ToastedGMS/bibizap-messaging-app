const express = require('express');
const app = express();
const cors = require('cors');
const http = require('http').Server(app);
const { Server } = require('socket.io');

const PORT = 4000;

app.use(cors());

const io = new Server(http, {
	cors: {
		origin: '*',
	},
});

app.get('/api', (req, res) => {
	res.json({
		message: 'Hello world',
	});
});

io.on('connection', (socket) => {
	console.log(`⚡: ${socket.id} user just connected!`);

	socket.on('disconnect', () => {
		console.log('🔥: A user disconnected');
	});
});

http.listen(PORT, () => {
	console.log(`Server listening on http://localhost:${PORT}`);
});
