const sendFriendRequest = async ({
	serverUrl,
	accessToken,
	targetUserName,
	setErrorMessage,
	setSendingRequest,
	setTargetUserName,
	fetchFriendships,
}) => {
	if (!targetUserName) {
		setErrorMessage('Please provide a username');
		return;
	}

	setSendingRequest(true);

	try {
		const response = await fetch(`${serverUrl}/api/friends/send`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				authorization: `Bearer ${accessToken}`,
			},
			body: JSON.stringify({ targetUserName }),
		});

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

export default sendFriendRequest;
