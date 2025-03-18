import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ChatButton({ request, socket }) {
	const navigate = useNavigate();

	const onClick = () => {
		const roomName = `${request.senderId}_${request.receiverId}`;
		socket.emit('checkRoom', roomName, (exists) => {
			if (exists) {
				socket.emit('joinRoom', roomName);
				console.log('Joining existing room:', roomName);
			} else {
				socket.emit('createRoom', roomName);
				console.log('Creating a new room:', roomName);
			}
		});
		navigate('/chats/chat', { state: { roomName } });
	};

	return (
		<button className="friendRequestBtn" onClick={onClick}>
			Chat
		</button>
	);
}
