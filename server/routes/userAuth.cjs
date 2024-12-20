const { fetchUser, updateUser } = require('../controllers/userInfo.cjs');

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
		return res.status(500).json({ error: error.message });
	}
});

router.post('/login', async (req, res) => {
	const { identification, password } = req.body;

	if (!identification || !password) {
		return res.status(400).json({ error: 'Missing required fields' });
	}

	try {
		const info = await checkCredentials(identification, password);

		return res.status(200).json({ message: 'Login successful', info });
	} catch (error) {
		console.error('Error during user login:', error);
		if (error.message.includes('Unable to find matching credentials')) {
			return res.status(400).json({ error: error.message });
		}
		return res.status(500).json({ error: error.message });
	}
});

router.get('/:id', async (req, res) => {
	const { id } = req.params;

	try {
		const user = await fetchUser(id);

		return res.status(200).json({ user });
	} catch (error) {
		console.error('Error fetching user information:', error);
		if (
			error.message.includes(
				'Could not find your user on the database. Please try again.'
			)
		) {
			return res.status(404).json({
				error: 'User not found',
			});
		}
		return res.status(500).json({
			error: 'An unexpected error occurred',
		});
	}
});

router.put('/:id', async (req, res) => {
	const { id } = req.params;

	const { username, bio, dp, email } = req.body;

	const userInfo = { id: parseInt(id, 10), username, bio, dp, email };

	try {
		const updatedUser = await updateUser({ userInfo });

		return res
			.status(202)
			.json({ message: 'User updated successfully.', updatedUser });
	} catch (error) {
		console.error('Error updating user', error);
		if (
			error.message.includes('is not available') ||
			error.message.includes('for updating')
		) {
			return res.status(400).json({ error: error.message });
		} else {
			return res
				.status(500)
				.json({ error: 'An unexpected error ocurred. Please try again.' });
		}
	}
});

module.exports = router;
