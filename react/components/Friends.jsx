import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Friends({
	userInfoState,
	setErrorMessage,
	accessToken,
	socketID,
	socket,
}) {
	const navigate = useNavigate();
	const { userInfo } = userInfoState;
	const [loading, setLoading] = useState(false);
	const [updating, setUpdating] = useState(false);
	const [friendRequests, setFriendRequests] = useState({
		accepted: [],
		sentPending: [],
		receivedPending: [],
		receivedRejected: [],
	});
	const [targetUserName, setTargetUserName] = useState(''); // New state for the target username
	const [sendingRequest, setSendingRequest] = useState(false); // New state for sending request

	const fetchFriendships = async () => {
		setLoading(true);
		try {
			const response = await fetch(
				'http://192.168.1.28:4000/api/friends/requests',
				{
					method: 'GET',
					headers: {
						authorization: `Bearer ${accessToken}`,
					},
				}
			);

			if (!response.ok) {
				console.error('Failed to fetch friendship info');
			}

			const data = await response.json();

			const groupedRequests = {
				accepted: [],
				sentPending: [],
				receivedPending: [],
				receivedRejected: [],
			};

			// Loop through all friend requests and categorize them
			data.friendRequests.received.accepted.forEach((request) => {
				groupedRequests.accepted.push(request);
			});

			data.friendRequests.sent.accepted.forEach((request) => {
				groupedRequests.accepted.push(request);
			});

			data.friendRequests.sent.pending.forEach((request) => {
				groupedRequests.sentPending.push(request); // Sent by the user
			});

			data.friendRequests.received.pending.forEach((request) => {
				groupedRequests.receivedPending.push(request); // Received by the user
			});

			data.friendRequests.received.rejected.forEach((request) => {
				groupedRequests.receivedRejected.push(request); // Received by the user
			});

			setFriendRequests(groupedRequests);
		} catch (error) {
			setErrorMessage('Error fetching user data');
			console.error('Error fetching user data:', error);
		} finally {
			setLoading(false);
			setUpdating(false);
		}
	};

	// Function to send a friend request to the target username
	const sendFriendRequest = async () => {
		if (!targetUserName) {
			setErrorMessage('Please provide a username');
			return;
		}

		setSendingRequest(true);

		try {
			const response = await fetch(
				'http://192.168.1.28:4000/api/friends/send',
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						authorization: `Bearer ${accessToken}`,
					},
					body: JSON.stringify({
						targetUserName,
					}),
				}
			);

			if (!response.ok) {
				const errorData = await response.json();
				setErrorMessage(errorData.error);
				return;
			}

			const data = await response.json();
			alert(data.message); // Show success message to the user
			setTargetUserName(''); // Reset the input field
			fetchFriendships(); // Refresh friend requests list
		} catch (error) {
			setErrorMessage('Error sending friend request');
			console.error('Error sending friend request:', error);
		} finally {
			setSendingRequest(false);
		}
	};

	async function handleClick(title, request) {
		setUpdating(true);
		try {
			const response = await fetch(
				`http://192.168.1.28:4000/api/friends/${title}`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						authorization: `Bearer ${accessToken}`,
					},
					body: JSON.stringify({ senderId: request.senderId }),
				}
			);

			if (!response.ok) {
				throw new Error('Failed to accept the request');
			}

			const data = await response.json();

			fetchFriendships();
		} catch (error) {
			console.error('Error accepting the request:', error);
		}
	}

	const acceptButton = {
		title: 'accept',
		label: 'Accept',
		onClick: (request) => handleClick('accept', request),
	};

	const rejectButton = {
		title: 'reject',
		label: 'Reject',
		onClick: (request) => handleClick('reject', request),
	};

	const chatButton = {
		label: 'Chat',
		onClick: (request) => {
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
		},
	};

	useEffect(() => {
		if (userInfo === null) {
			console.log('userInfo', userInfo);
			setErrorMessage('Please login.');
			navigate('/login');
		} else {
			fetchFriendships();
		}
	}, [userInfo, navigate, accessToken, setErrorMessage]);

	const renderFriendRequests = (requests, ...opts) => {
		return requests.map((request) => (
			<div key={request.id} className="friend-request">
				<div>
					{/* If the current user is the receiver of the request, show sender's details */}
					{request.receiverId === userInfo.id ? (
						<div>
							<img
								style={{
									width: '5em',
									height: '5em',
									borderRadius: '50%',
									objectFit: 'cover',
								}}
								src={
									request.sender.dp === null
										? '/default-avatar.png'
										: request.sender.dp
								}
								alt={`${request.sender.username}'s profile`}
								className="friend-request-img"
							/>
							<div className="friend-request-info">
								<p>{request.sender.username}</p>
							</div>
							{opts.map((button, index) => (
								<button key={index} onClick={() => button.onClick(request)}>
									{button.label}
								</button>
							))}
						</div>
					) : (
						// If the current user is the sender, show receiver's details
						<div>
							<img
								style={{
									width: '5em',
									height: '5em',
									borderRadius: '50%',
									objectFit: 'cover',
								}}
								src={
									request.receiver.dp === null
										? '/default-avatar.png'
										: request.receiver.dp
								}
								alt={`${request.receiver.username}'s profile`}
								className="friend-request-img"
							/>
							<div className="friend-request-info">
								<p>{request.receiver.username}</p>
							</div>
							{opts.map((button, index) => (
								<button key={index} onClick={() => button.onClick(request)}>
									{button.label}
								</button>
							))}
						</div>
					)}
				</div>
			</div>
		));
	};

	return (
		<>
			{loading ? (
				<h1>Loading...</h1>
			) : updating ? (
				<h1>Updating friends list...</h1>
			) : (
				<div className="friendship-container">
					{/* New section to send a friend request */}
					<div className="send-friend-request">
						<h3>Send Friend Request</h3>
						<input
							type="text"
							placeholder="Enter username"
							value={targetUserName}
							onChange={(e) => setTargetUserName(e.target.value)}
						/>
						<button onClick={sendFriendRequest} disabled={sendingRequest}>
							{sendingRequest ? 'Sending...' : 'Send Request'}
						</button>
					</div>

					<div className="friendship-category">
						<h3>Accepted Friend Requests</h3>
						{renderFriendRequests(friendRequests.accepted, chatButton)}
					</div>

					<div className="friendship-category">
						<h3>Sent Pending Friend Requests</h3>
						{renderFriendRequests(friendRequests.sentPending)}
					</div>

					<div className="friendship-category">
						<h3>Received Pending Friend Requests</h3>
						{renderFriendRequests(
							friendRequests.receivedPending,
							acceptButton,
							rejectButton
						)}
					</div>

					<div className="friendship-category">
						<h3>Received Rejected Friend Requests</h3>
						{renderFriendRequests(friendRequests.receivedRejected)}
					</div>

					<button onClick={() => navigate('/user')}>Return</button>
					<button onClick={() => navigate('/logout')}>Logout</button>
				</div>
			)}
		</>
	);
}
