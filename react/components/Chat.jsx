import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Message from './Message';
import styles from '../stylesheets/Chat.module.css';

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

	// Effect for handling socket connections and user authentication
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

	// Effect for scrolling the send button into view when messages update
	useEffect(() => {
		const sendBtn = document.querySelector('.sendBtn');
		sendBtn.scrollIntoView({ behavior: 'smooth' });
	}, [messages]);

	return (
		<>
			<div className={styles.messages}>
				{messages.map((message, index) => (
					<Message key={index} message={message} userInfo={userInfo} />
				))}
			</div>
			<div className={styles.inputBox}>
				<input
					type="text"
					value={messageText}
					onChange={(e) => setMessageText(e.target.value)}
					placeholder="Type your message..."
				/>
				<button
					className="sendBtn"
					style={{
						padding: '10px 20px',
						backgroundColor: '#007bff',
						color: '#fff',
						border: 'none',
						borderRadius: '4px',
						cursor: 'pointer',
					}}
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
						}
					}}
				>
					Send
				</button>
			</div>
		</>
	);
}
