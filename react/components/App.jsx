import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

const socket = io('http://localhost:4000');

function App({ userInfo }) {
	const navigate = useNavigate();

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

	return (
		<>
			<h1>Hello, {userInfo.username}</h1>
			<button onClick={() => navigate('/logout')}>Logout</button>
		</>
	);
}

export default App;
