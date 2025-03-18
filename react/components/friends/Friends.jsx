import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../stylesheets/Friends.module.css';
import UserContext from '../../context/UserContext';
import ErrorContext from '../../context/ErrorContext';
import TokenContext from '../../context/TokenContext';
import sendFriendRequest from './SendFriendRequest';
import AcceptButton from './AcceptButton';
import ChatButton from './ChatButton';
import LogoutButton from '../shared/LogoutButton';
import HomeButton from '../shared/HomeButton';
const serverUrl = import.meta.env.VITE_SERVER_URL;

export default function Friends({ socket }) {
	const { userInfo } = useContext(UserContext);
	const { setErrorMessage } = useContext(ErrorContext);
	const { accessToken } = useContext(TokenContext);

	const [loading, setLoading] = useState(false);
	const [updating, setUpdating] = useState(false);
	const [friendRequests, setFriendRequests] = useState({
		accepted: [],
		pending: [],
		receivedRejected: [],
	});

	const [targetUserName, setTargetUserName] = useState('');
	const [sendingRequest, setSendingRequest] = useState(false);

	const navigate = useNavigate();

	const fetchFriendships = async () => {
		setLoading(true);
		try {
			const response = await fetch(`${serverUrl}/api/friends/requests`, {
				method: 'GET',
				headers: {
					authorization: `Bearer ${accessToken}`,
				},
			});

			if (!response.ok) {
				console.error('Failed to fetch friendship info');
			}

			const data = await response.json();

			const groupedRequests = {
				accepted: [],
				pending: [],
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
				groupedRequests.pending.push(request); // Sent by the user
			});

			data.friendRequests.received.pending.forEach((request) => {
				groupedRequests.pending.push(request); // Received by the user
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

	useEffect(() => {
		if (userInfo === null || userInfo === undefined) {
			setErrorMessage('Please login.');
			navigate('/login');
			return;
		} else {
			fetchFriendships();
		}
	}, [userInfo]);

	const handleSendRequest = async () => {
		await sendFriendRequest({
			serverUrl,
			accessToken,
			targetUserName,
			setErrorMessage,
			setSendingRequest,
			setTargetUserName,
			fetchFriendships,
		});
	};

	const renderFriendRequests = (requests, status) => {
		return requests.map((request) => (
			<div key={request.id} className={styles.friendRequest}>
				<div>
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
								<p>@{request.sender.username}</p>
							</div>
							{status === 'pending' ? (
								<AcceptButton
									request={request}
									serverUrl={serverUrl}
									accessToken={accessToken}
									fetchFriendships={fetchFriendships}
								/>
							) : status === 'accepted' ? (
								<ChatButton socket={socket} request={request} />
							) : null}
						</div>
					) : (
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
							{status === 'pending' ? (
								<AcceptButton
									request={request}
									serverUrl={serverUrl}
									accessToken={accessToken}
									fetchFriendships={fetchFriendships}
								/>
							) : status === 'accepted' ? (
								<ChatButton socket={socket} request={request} />
							) : null}
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
				<div className={styles.friendshipContainer}>
					<div className={styles.friendshipCategory}>
						<h3>Accepted Friend Requests</h3>
						<br />
						<div className={styles.goddamnDiv}>
							{renderFriendRequests(friendRequests.accepted, 'accepted')}
						</div>
					</div>

					<div className={styles.friendshipCategory}>
						<h3> Pending Friend Requests</h3>
						<br />
						{renderFriendRequests(friendRequests.pending, 'pending')}
					</div>

					<div className={styles.friendshipCategory}>
						<h3>Received Rejected Friend Requests</h3>
						<br />
						{renderFriendRequests(friendRequests.receivedRejected)}
					</div>

					<div className={styles.sendFriendRequest}>
						<h3>Send Friend Request</h3>
						<input
							type="text"
							placeholder="Enter username"
							value={targetUserName}
							onChange={(e) => setTargetUserName(e.target.value)}
						/>
						<button
							className={styles.friendBtn}
							onClick={handleSendRequest}
							disabled={sendingRequest}
						>
							{sendingRequest ? 'Sending...' : 'Send Request'}
						</button>
					</div>
					<br />

					<HomeButton />
					<LogoutButton />
				</div>
			)}
		</>
	);
}
