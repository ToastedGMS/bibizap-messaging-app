const { dbCreateUser } = require('../../prisma/scripts/userScripts.cjs');

async function createUser(email, password, bio, dp, username) {
	if (!email || !password || !username) {
		throw new Error('One or more missing parameters for user creation');
	}

	const userInfo = { email, password, bio, dp, username };

	try {
		const newUser = await dbCreateUser({ userInfo });

		if (!newUser) {
			throw new Error('User creation failed: No user returned from database');
		}
		return newUser;
	} catch (error) {
		console.error('Error accessing database', error);
		throw error;
	}
}

module.exports = { createUser };
