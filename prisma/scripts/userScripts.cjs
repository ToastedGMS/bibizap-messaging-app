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
	} finally {
		await prisma.$disconnect();
	}
}

module.exports = { dbCreateUser };
