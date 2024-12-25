import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Message from './Message';

export default function Chat({
	userInfoState,
	setErrorMessage,
	socket,
	socketID,
}) {
	const { userInfo } = userInfoState;
	const navigate = useNavigate();
	const [messages, setMessages] = useState([]);
	const [messageText, setMessageText] = useState('');
	const location = useLocation();
	const roomName = location.state?.roomName;

	useEffect(() => {
		if (userInfo === null) {
			console.log('userInfo', userInfo);
			setErrorMessage('Please login.');
			navigate('/login');
		}

		console.log('Connecting to socket...');

		if (roomName) {
			console.log(`Joining room: ${roomName}`);
			socket.emit('joinRoom', roomName);
		}

		socket.on('message', (message) => {
			setMessages((prevMessages) => [...prevMessages, message]);
		});

		socket.on('disconnect', () => {
			console.log('Disconnected from socket.');
		});

		console.log('messages', messages);

		return () => {
			socket.off('connect');
			socket.off('message');
			socket.off('disconnect');
		};
	}, [userInfo, navigate, setErrorMessage, socket]);

	return (
		<>
			<div className="messages">
				{messages.map((message, index) => (
					<Message
						key={index}
						username={message.username}
						text={message.text}
					/>
				))}
			</div>
			<div className="input-box">
				<input
					type="text"
					value={messageText}
					onChange={(e) => setMessageText(e.target.value)}
					placeholder="Type your message..."
				/>
				<button
					onClick={(e) => {
						e.preventDefault();
						if (messageText.trim() && roomName) {
							socket.emit('sendMessage', {
								username: userInfo.username,
								text: messageText,
								roomName: roomName,
							});
							setMessageText('');
						}
					}}
				>
					Send
				</button>
			</div>
		</>
	);
}
