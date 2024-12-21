const router = require('express').Router();
const {
	sendRequest,
	allFriendRequests,
	acceptRequest,
	rejectRequest,
} = require('../controllers/friendController.cjs');
const { verifyToken } = require('../controllers/userAuth.cjs');

router.post('/send', verifyToken, async (req, res) => {
	const { targetUserId } = req.body;

	if (!targetUserId) {
		return res.status(400).json({ error: 'Target user ID is required' });
	}

	try {
		const result = await sendRequest(req.user.id, targetUserId);
		return res
			.status(201)
			.json({ message: 'Friend request sent', request: result });
	} catch (error) {
		console.error('Error sending friend request:', error);
		return res.status(500).json({ error: error.message });
	}
});

router.get('/requests', verifyToken, async (req, res) => {
	try {
		const requests = await allFriendRequests(req.user.id);
		return res.status(200).json({ friendRequests: requests });
	} catch (error) {
		console.error('Error fetching pending friend requests:', error);
		return res.status(500).json({ error: error.message });
	}
});

router.post('/accept', verifyToken, async (req, res) => {
	const { senderId } = req.body;

	if (!senderId) {
		return res
			.status(400)
			.json({ error: 'Sender ID is required to accept the request' });
	}

	try {
		const result = await acceptRequest(senderId, req.user.id);
		return res.status(200).json({ message: 'Friend request accepted', result });
	} catch (error) {
		console.error('Error accepting friend request:', error);
		return res.status(500).json({ error: error.message });
	}
});

router.post('/reject', verifyToken, async (req, res) => {
	const { senderId } = req.body;

	if (!senderId) {
		return res
			.status(400)
			.json({ error: 'Sender ID is required to reject the request' });
	}

	try {
		const result = await rejectRequest(senderId, req.user.id);
		return res.status(200).json({ message: 'Friend request rejected', result });
	} catch (error) {
		console.error('Error rejecting friend request:', error);
		return res.status(500).json({ error: error.message });
	}
});

module.exports = router;
