// RejectButton.js
import React from 'react';
import { handleFriendRequest } from './FriendRequestAction';

export default function RejectButton({
	request,
	serverUrl,
	accessToken,
	fetchFriendships,
}) {
	const onClick = () =>
		handleFriendRequest({
			title: 'reject',
			request,
			serverUrl,
			accessToken,
			fetchFriendships,
		});

	return (
		<button className="friendRequestBtn" onClick={onClick}>
			Reject
		</button>
	);
}
