import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../stylesheets/UserProfile.module.css';

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
		<div className={styles.container}>
			{userInfo === null ? null : (
				<div className={styles.profileDiv}>
					<img src={userInfo.dp} alt={'User Profile Picture'} />
					<h2>@{userInfo.username}</h2>
					<p>{userInfo.bio}</p>
					<button
						className={styles.profileBtn}
						onClick={() => navigate('/user/friendships')}
					>
						Friendships
					</button>
					<br />
					<br />
					<button
						className={styles.profileBtn}
						onClick={() => navigate('/user/update')}
					>
						Edit Profile
					</button>
					<br />
					<br />
					<button
						className={styles.profileBtn}
						onClick={() => navigate('/logout')}
					>
						Logout
					</button>
				</div>
			)}
		</div>
	);
}
