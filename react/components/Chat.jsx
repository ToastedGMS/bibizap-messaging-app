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

	let recipientId = null;
	if (roomName) {
		const [senderId, receiverId] = roomName.split('_');
		recipientId = senderId !== userInfo.id.toString() ? senderId : receiverId;
	}

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

		socket.on('roomMessages', (messages) => {
			setMessages(messages);
		});

		socket.on('message', (message) => {
			setMessages((prevMessages) => [...prevMessages, message]);
		});

		socket.on('disconnect', () => {
			console.log('Disconnected from socket.');
		});

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
					<Message key={index} message={message} />
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
								textContent: messageText,
								authorId: userInfo.id,
								recipientId: recipientId,
								chatId: roomName,
							});
							setMessageText('');
							console.log('messages', messages);
						}
					}}
				>
					Send
				</button>
			</div>
		</>
	);
}
