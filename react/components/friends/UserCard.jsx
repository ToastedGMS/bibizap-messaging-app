import React from 'react';
import styles from '../../stylesheets/Friends.module.css';
import AcceptButton from './AcceptButton';
import ChatButton from './ChatButton';

const UserCard = ({
	request,
	status,
	userInfo,
	serverUrl,
	accessToken,
	fetchFriendships,
	socket,
}) => {
	const isReceiver = request.receiverId === userInfo.id;
	const user = isReceiver ? request.sender : request.receiver;

	return (
		<div className={styles.friendRequest}>
			<div>
				<img
					style={{
						width: '5em',
						height: '5em',
						borderRadius: '50%',
						objectFit: 'cover',
					}}
					src={user.dp === null ? '/default-avatar.png' : user.dp}
					alt={`${user.username}'s profile`}
					className="friend-request-img"
				/>
				<div className="friend-request-info">
					<p>@{user.username}</p>
				</div>

				{/* Render the appropriate button based on the status */}
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
		</div>
	);
};

export default UserCard;
