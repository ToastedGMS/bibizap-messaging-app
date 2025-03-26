const serverUrl = import.meta.env.VITE_SERVER_URL;

export const fetchUserInfo = async (id) => {
	try {
		const response = await fetch(`${serverUrl}/api/users/${id}`);

		if (!response.ok) {
			throw new Error('Failed to fetch user info');
		}

		const data = await response.json();
		return data.user;
	} catch (error) {
		throw new Error('Failed to fetch user info');
	}
};
