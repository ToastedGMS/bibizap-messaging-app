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
		throw error;
	}
}

function verifyToken(req, res, next) {
	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];

	if (!token) {
		return res
			.status(401)
			.json({ error: 'Missing token. Authorization denied.' });
	}

	jwt.verify(token, jwtSecretKey, (error, decoded) => {
		if (error) {
			console.error('JWT verification error:', error.message);
			return res.status(403).json({ error: 'Forbidden' });
		}

		req.user = {
			id: decoded.id,
		};

		next();
	});
}

module.exports = { createUser, checkCredentials, verifyToken };
