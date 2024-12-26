const prisma = require('../client.cjs');

async function dbSendRequest({ friendInfo }) {
	const { userId, targetUserName } = friendInfo;

	if (!userId || !targetUserName) {
		throw new Error(
			'Both userId and targetUserName are required to send a friend request.'
		);
	}

	try {
		// Fetch the user ID of the target user by username
		const targetUser = await prisma.user.findUnique({
			where: {
				username: targetUserName,
			},
			select: {
				id: true,
			},
		});

		if (!targetUser) {
			throw new Error('Target user not found.');
		}

		const targetUserId = targetUser.id;

		const sendRequest = await prisma.friendRequest.create({
			data: {
				senderId: userId,
				receiverId: targetUserId,
				status: 'pending',
			},
		});

		return sendRequest;
	} catch (error) {
		console.error('Error sending friend request:', error);
		throw error;
	}
}

async function dbAllFriendRequests(userId) {
	if (!userId) {
		throw new Error('UserId is required to fetch friend requests.');
	}

	try {
		// Fetch all requests where the user is either the sender or receiver
		const allRequests = await prisma.friendRequest.findMany({
			where: {
				OR: [
					{ receiverId: userId }, // Requests received by the user
					{ senderId: userId }, // Requests sent by the user
				],
			},
			include: {
				sender: {
					select: {
						id: true,
						username: true,
						dp: true, // Profile picture field
					},
				},
				receiver: {
					select: {
						id: true,
						username: true,
						dp: true, // Profile picture field
					},
				},
			},
		});

		const groupedRequests = {
			sent: {
				pending: [],
				accepted: [],
				rejected: [],
			},
			received: {
				pending: [],
				accepted: [],
				rejected: [],
			},
		};

		// Loop through all requests and categorize them
		allRequests.forEach((request) => {
			// If the user is the sender, categorize under 'sent'
			if (request.senderId === userId) {
				groupedRequests.sent[request.status].push(request);
			}
			// If the user is the receiver, categorize under 'received'
			else if (request.receiverId === userId) {
				groupedRequests.received[request.status].push(request);
			}
		});

		return groupedRequests;
	} catch (error) {
		console.error('Error fetching all friend requests:', error);
		throw error;
	}
}

async function dbAcceptRequest({ requestInfo }) {
	const { senderId, receiverId } = requestInfo;

	if (!senderId || !receiverId) {
		throw new Error(
			'Both senderId and receiverId are required to accept a friend request.'
		);
	}

	try {
		const updatedRequest = await prisma.friendRequest.update({
			where: {
				senderId_receiverId: { senderId, receiverId },
			},
			data: {
				status: 'accepted',
			},
		});

		await prisma.user.update({
			where: { id: senderId },
			data: {
				friends: {
					connect: { id: receiverId },
				},
			},
		});

		await prisma.user.update({
			where: { id: receiverId },
			data: {
				friends: {
					connect: { id: senderId },
				},
			},
		});

		return updatedRequest;
	} catch (error) {
		console.error('Error accepting friend request:', error);
		throw error;
	}
}

async function dbRejectRequest({ requestInfo }) {
	const { senderId, receiverId } = requestInfo;

	if (!senderId || !receiverId) {
		throw new Error(
			'Both senderId and receiverId are required to reject a friend request.'
		);
	}

	try {
		const rejectedRequest = await prisma.friendRequest.update({
			where: {
				senderId_receiverId: { senderId, receiverId },
			},
			data: {
				status: 'rejected',
			},
		});

		return rejectedRequest;
	} catch (error) {
		console.error('Error rejecting friend request:', error);
		throw error;
	}
}

module.exports = {
	dbSendRequest,
	dbAcceptRequest,
	dbAllFriendRequests,
	dbRejectRequest,
};
