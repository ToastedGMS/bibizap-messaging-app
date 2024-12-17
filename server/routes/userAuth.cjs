const router = require('express').Router();
const { createUser, checkCredentials } = require('../controllers/userAuth.cjs');

router.post('/new', async (req, res) => {
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

router.post('/login', async (req, res) => {
	const { identification, password } = req.body;

	if (!identification || !password) {
		return res.status(400).json({ error: 'Missing required fields' });
	}

	try {
		const info = await checkCredentials(identification, password);

		if (info) {
			return res.status(200).json({ message: 'Login successful', info });
		} else {
			return res.status(401).json({ error: 'User login failed' });
		}
	} catch (error) {
		console.error('Error during user login:', error);
		return res.status(500).json({ error: 'Internal server error' });
	}
});

module.exports = router;
