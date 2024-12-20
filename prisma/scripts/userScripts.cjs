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

async function dbFetchUser(id) {
	const idParsed = parseInt(id, 10);

	try {
		const user = await prisma.user.findFirst({
			where: {
				id: idParsed,
			},
		});

		if (!user) {
			throw new Error(
				'Could not find your user on the database. Please try again.'
			);
		}

		return {
			id: user.id,
			username: user.username,
			bio: user.bio || 'No bio available',
			dp: user.dp || 'default-avatar.png',
			email: user.email,
		};
	} catch (error) {
		console.error('Error fetching user information', error);
		throw error;
	}
}

async function dbUpdateUser({ userInfo }) {
	const { id, username, bio, dp, email } = userInfo;

	if (!id) {
		throw new Error('User ID is required for updating');
	}

	if (!username && !bio && !dp && !email) {
		throw new Error('No fields provided for updating the user');
	}

	try {
		if (email) {
			const existingEmail = await prisma.user.findFirst({
				where: {
					email,
					NOT: { id }, // Exclude current user
				},
			});
			if (existingEmail) {
				throw new Error('That email address is not available');
			}
		}

		if (username) {
			const existingUsername = await prisma.user.findFirst({
				where: {
					username,
					NOT: { id }, // Exclude current user
				},
			});
			if (existingUsername) {
				throw new Error('That username is not available');
			}
		}

		const updatedUser = await prisma.user.update({
			where: { id },
			data: {
				username: username || undefined,
				bio: bio || undefined,
				dp: dp || undefined,
				email: email || undefined,
			},
		});

		return updatedUser;
	} catch (error) {
		console.error('Error updating user info', error);
		throw error;
	}
}

module.exports = {
	dbCreateUser,
	dbCheckCredentials,
	dbFetchUser,
	dbUpdateUser,
};
