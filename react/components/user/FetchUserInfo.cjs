export const fetchUserInfo = async (id) => {
	try {
		const response = await fetch(`http://192.168.1.28:4000/api/users/${id}`);

		if (!response.ok) {
			throw new Error('Failed to fetch user info');
		}

		const data = await response.json();
		return data.user;
	} catch (error) {
		throw new Error('Failed to fetch user info');
	}
};
