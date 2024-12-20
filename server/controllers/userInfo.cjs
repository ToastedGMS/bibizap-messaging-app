const {
	dbFetchUser,
	dbUpdateUser,
} = require('../../prisma/scripts/userScripts.cjs');

async function fetchUser(id) {
	if (!id) {
		throw new Error('Id was not provided. Please try again.');
	}

	try {
		const user = await dbFetchUser(id);

		return user;
	} catch (error) {
		console.error('Error fetching user information:', error.message);
		throw error;
	}
}

async function updateUser({ userInfo }) {
	try {
		const updatedUser = await dbUpdateUser({ userInfo });
		return updatedUser;
	} catch (error) {
		console.error(`Error updating user with ID: ${userInfo.id}`, error);
		throw error;
	}
}

module.exports = { fetchUser, updateUser };
