const {
	dbCreateUser,
	dbCheckCredentials,
} = require('../../prisma/scripts/userScripts.cjs');
const jwt = require('jsonwebtoken');
const jwtSecretKey = process.env.JWT_SECRET_KEY;
const jwtExpiry = process.env.TOKEN_EXPIRY_TIME || '1h';

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

async function checkCredentials(identification, password) {
	if (!identification || !password) {
		throw new Error('One or more missing parameters for checking credentials');
	}

	if (!jwtSecretKey) {
		throw new Error('JWT secret key is not defined in environment variables');
	}

	const userInfo = { identification, password };

	try {
		const authorizedUser = await dbCheckCredentials({ userInfo });
		const token = jwt.sign(
			{
				id: authorizedUser.id,
			},
			jwtSecretKey,
			{ expiresIn: jwtExpiry }
		);

		return {
			token,
			user: {
				id: authorizedUser.id,
				email: authorizedUser.email,
				username: authorizedUser.username,
			},
		};
	} catch (error) {
		console.error('Error checking user credentials:', error.message);
		throw new Error('Failed to validate user credentials');
	}
}

module.exports = { createUser, checkCredentials };
