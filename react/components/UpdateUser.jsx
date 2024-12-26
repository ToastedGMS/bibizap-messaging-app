import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../stylesheets/UpdateUser.module.css';

export default function UpdateUser({
	userInfoState,
	setErrorMessage,
	accessToken,
}) {
	const { userInfo, setUserInfo } = userInfoState;
	const [username, setUsername] = useState('');
	const [bio, setBio] = useState('');
	const [dp, setDp] = useState('');
	const [email, setEmail] = useState('');
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (userInfo) {
			setUsername(userInfo.username);
			setBio(userInfo.bio);
			setEmail(userInfo.email);
		} else {
			setErrorMessage('Please login.');
			navigate('/login');
			return;
		}
	}, [userInfo]);

	const updateUserInfo = async (e) => {
		e.preventDefault();
		setLoading(true);

		const updatedUserInfo = {
			username,
			bio,
			dp,
			email,
		};

		try {
			const response = await fetch(
				`http://192.168.1.28:4000/api/users/${userInfo.id}`,
				{
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${accessToken}`,
					},
					body: JSON.stringify(updatedUserInfo),
				}
			);

			if (!response.ok) {
				const errorData = await response.json();
				console.error('Failed to update user info', errorData);
				setErrorMessage('Failed to update user info', errorData);
				navigate('/login');

				return;
			}

			const data = await response.json();
			setUserInfo(data.updatedUser);
			console.log('user', data);
			navigate('/user');
		} catch (error) {
			console.error('Error updating user data:', error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			{loading === true ? (
				<h1>Loading...</h1>
			) : (
				<div className={styles.container}>
					<div className={styles.FormContainer}>
						<form onSubmit={updateUserInfo}>
							<div className={styles.formDiv}>
								<label>Username</label> <br />
								<input
									type="text"
									value={username}
									onChange={(e) => setUsername(e.target.value)}
									placeholder="Username"
									pattern="^[A-Za-z0-9]+$"
									required
									title="Username can only contain letters and numbers (no spaces or special characters)"
								/>
							</div>
							<div className={styles.formDiv}>
								<label>Bio</label> <br />
								<textarea
									value={bio}
									onChange={(e) => setBio(e.target.value)}
									maxLength={140}
									placeholder="Bio"
								/>
							</div>
							<div className={styles.formDiv}>
								<label>Profile Picture URL</label> <br />
								<input
									type="text"
									value={dp}
									onChange={(e) => setDp(e.target.value)}
									placeholder="Profile Picture URL"
								/>
							</div>
							<div className={styles.formDiv}>
								<label>Email</label> <br />
								<input
									type="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									pattern="^[a-zA-Z0-9._%+-]+@require\.com$"
									placeholder="Email"
									required
									title="Please inform a valid email"
								/>
							</div>
							<br />
							<div>
								<button className={styles.profileBtn} type="submit">
									Update Profile
								</button>
							</div>
						</form>
						<button
							className={styles.profileBtn}
							onClick={() => navigate('/user')}
						>
							Return
						</button>{' '}
					</div>
				</div>
			)}
		</>
	);
}
