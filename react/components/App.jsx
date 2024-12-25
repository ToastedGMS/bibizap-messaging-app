// import React, { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { io } from 'socket.io-client';

// const socket = io('http://192.168.1.28:4000');

// function App({ userInfo, errorState }) {
// 	const { errorMessage, setErrorMessage } = errorState;
// 	const navigate = useNavigate();

// 	useEffect(() => {
// 		console.log('Connecting to socket...');

// 		socket.on('connect', () => {
// 			console.log(`Connected: ${socket.id}`);
// 		});

// 		socket.on('disconnect', () => {
// 			console.log('Disconnected from socket.');
// 		});

// 		if (userInfo === null) {
// 			setErrorMessage('Please login.');
// 			navigate('/login');
// 		}

// 		return () => {
// 			socket.disconnect();
// 		};
// 	}, [userInfo, navigate]);

// 	return (
// 		<>
// 			{userInfo === null ? null : (
// 				<>
// 					<h1>Hello, {userInfo.username}</h1>
// 					<button onClick={() => navigate('/logout')}>Logout</button>
// 				</>
// 			)}
// 		</>
// 	);
// }

// export default App;
