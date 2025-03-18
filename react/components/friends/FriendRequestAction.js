export async function handleFriendRequest({
	title,
	request,
	serverUrl,
	accessToken,
	fetchFriendships,
}) {
	try {
		const response = await fetch(`${serverUrl}/api/friends/${title}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				authorization: `Bearer ${accessToken}`,
			},
			body: JSON.stringify({ senderId: request.senderId }),
		});

		if (!response.ok) {
			throw new Error('Failed to accept/reject the request');
		}

		await response.json();
		fetchFriendships(); // Refresh the friend requests list
	} catch (error) {
		console.error(`Error ${title} the request:`, error);
	}
}
