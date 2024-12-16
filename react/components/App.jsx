import React, { useEffect } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:4000');

function App() {
	useEffect(() => {
		console.log('Connecting to socket...');

		socket.on('connect', () => {
			console.log(`Connected: ${socket.id}`);
		});

		socket.on('disconnect', () => {
			console.log('Disconnected from socket.');
		});

		return () => {
			socket.disconnect();
		};
	}, []);

	return <h1>Hello</h1>;
}

export default App;
