export const fetchUserInfo = async (id) => {
	try {
		const response = await fetch(`http://192.168.1.28:4000/api/users/${id}`);

		if (!response.ok) {
			console.error('Failed to fetch user info');
		}

		const data = await response.json();
		return data.user;
	} catch (error) {
		setErrorMessage('Error fetching user data');
		console.error('Error fetching user data:', error);
	}
};
