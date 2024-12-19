const prisma = require('../client.cjs');
const bcrypt = require('bcryptjs');

async function dbCreateUser({ userInfo }) {
	const { email, password, bio, dp, username } = userInfo;

	if (!email || !password || !username) {
		throw new Error('One or more missing parameters for user creation');
	}

	const hashedPassword = await bcrypt.hash(password, 10);

	try {
		const newUser = await prisma.user.create({
			data: {
				email,
				password: hashedPassword,
				username,
				bio: bio || null,
				dp: dp || null,
			},
		});

		if (newUser) {
			return newUser;
		}
	} catch (error) {
		console.error('Error creating user', error);
		throw error;
	}
}

async function dbCheckCredentials({ userInfo }) {
	const { identification, password } = userInfo;

	if (!identification || !password) {
		throw new Error('One or more missing parameters for checking credentials');
	}

	const stringType = identification.includes('@') ? 'email' : 'username';

	try {
		const user = await prisma.user.findFirst({
			where: {
				[stringType]: identification,
			},
		});

		if (!user) {
			throw new Error(
				'Unable to find matching credentials, check username and password and try again.'
			);
		}

		const passwordMatch = await bcrypt.compare(password, user.password);
		if (!passwordMatch) {
			throw new Error(
				'Unable to find matching credentials, check username and password and try again.'
			);
		}

		return { id: user.id, email: user.email, username: user.username };
	} catch (error) {
		console.error('Error checking user credentials', error);
		throw error;
	}
}

module.exports = { dbCreateUser, dbCheckCredentials };
