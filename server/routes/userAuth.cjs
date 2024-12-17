const router = require('express').Router();
const { createUser } = require('../controllers/userAuth.cjs');

router.post('/', async (req, res) => {
	const { email, password, bio, dp, username } = req.body;

	if (!email || !password || !username) {
		return res
			.status(400)
			.json({ error: 'Missing required fields: email, password, or username' });
	}

	try {
		const newUser = await createUser(email, password, bio, dp, username);

		if (newUser) {
			return res.status(201).json({ user: newUser });
		} else {
			return res.status(500).json({ error: 'User creation failed' });
		}
	} catch (error) {
		console.error('Error during user creation:', error);
		return res.status(500).json({ error: 'Internal server error' });
	}
});

module.exports = router;
