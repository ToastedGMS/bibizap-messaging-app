// AcceptButton.js
import React from 'react';
import { handleFriendRequest } from './FriendRequestAction';

export default function AcceptButton({
	request,
	serverUrl,
	accessToken,
	fetchFriendships,
}) {
	const onClick = () =>
		handleFriendRequest({
			title: 'accept',
			request,
			serverUrl,
			accessToken,
			fetchFriendships,
		});

	return (
		<button className="friendRequestBtn" onClick={onClick}>
			Accept
		</button>
	);
}
