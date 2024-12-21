const {
	dbSendRequest,
	dbAcceptRequest,
	dbAllFriendRequests,
	dbRejectRequest,
} = require('../../prisma/scripts/friendScripts.cjs');

async function sendRequest(userId, targetUserId) {
	if (!userId || !targetUserId) {
		throw new Error(
			'Both userId and targetUserId are required to send a friend request.'
		);
	}

	const friendInfo = { userId, targetUserId };

	try {
		const newRequest = await dbSendRequest({ friendInfo });
		return newRequest;
	} catch (error) {
		console.error('Error sending friend request:', error.message);
		throw error;
	}
}

async function allFriendRequests(userId) {
	if (!userId) {
		throw new Error('UserId is required to fetch pending requests.');
	}

	try {
		const friendRequests = await dbAllFriendRequests(userId);
		return friendRequests;
	} catch (error) {
		console.error('Error fetching pending requests:', error.message);
		throw error;
	}
}

async function acceptRequest(senderId, receiverId) {
	if (!senderId || !receiverId) {
		throw new Error(
			'Both senderId and receiverId are required to accept a friend request.'
		);
	}

	const requestInfo = { senderId, receiverId };

	try {
		const result = await dbAcceptRequest({ requestInfo });
		return result;
	} catch (error) {
		console.error('Error accepting friend request:', error.message);
		throw error;
	}
}

async function rejectRequest(senderId, receiverId) {
	if (!senderId || !receiverId) {
		throw new Error(
			'Both senderId and receiverId are required to reject a friend request.'
		);
	}

	const requestInfo = { senderId, receiverId };

	try {
		const result = await dbRejectRequest({ requestInfo });
		return result;
	} catch (error) {
		console.error('Error rejecting friend request:', error.message);
		throw error;
	}
}

module.exports = {
	sendRequest,
	allFriendRequests,
	acceptRequest,
	rejectRequest,
};
