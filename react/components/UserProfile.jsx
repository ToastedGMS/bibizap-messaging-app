import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function UserProfile({ userInfoState, setErrorMessage }) {
	const navigate = useNavigate();
	const { userInfo, setUserInfo } = userInfoState;

	useEffect(() => {
		if (userInfo === null) {
			setErrorMessage('Please login.');
			navigate('/login');
			return;
		}
		const fetchUserInfo = async () => {
			try {
				const response = await fetch(
					`http://192.168.1.28:4000/api/users/${userInfo.id}`
				);

				if (!response.ok) {
					console.error('Failed to fetch user info');
				}

				const data = await response.json();
				setUserInfo(data.user);
			} catch (error) {
				setErrorMessage('Error fetching user data');
				console.error('Error fetching user data:', error);
			}
		};

		fetchUserInfo();
	}, [userInfo, setErrorMessage]);

	return (
		<>
			{userInfo === null ? null : (
				<>
					<img
						style={{
							width: '20em',
							height: '20em',
							borderRadius: '50%',
							objectFit: 'cover',
						}}
						src={userInfo.dp}
						alt={'User Profile Picture'}
					/>
					<h1>{userInfo.username}</h1>
					<p>{userInfo.bio}</p>
					<p>{userInfo.email}</p>
					<button onClick={() => navigate('/user/friendships')}>
						Friendships
					</button>
					<br />
					<br />
					<button onClick={() => navigate('/user/update')}>Edit Profile</button>
					<br />
					<br />
					<button onClick={() => navigate('/chats')}>Chats</button>
					<br />
					<br />
					<button onClick={() => navigate('/logout')}>Logout</button>
				</>
			)}
		</>
	);
}
