import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function UpdateUser({ userInfoState, setErrorMessage }) {
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
				`http://localhost:4000/api/users/${userInfo.id}`,
				{
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
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
				<>
					<form onSubmit={updateUserInfo}>
						<div>
							<label>Username</label> <br />
							<br />
							<input
								type="text"
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								placeholder="Username"
								required
							/>
						</div>
						<div>
							<label>Bio</label> <br />
							<br />
							<textarea
								value={bio}
								onChange={(e) => setBio(e.target.value)}
								placeholder="Bio"
							/>
						</div>
						<div>
							<label>Profile Picture URL</label> <br />
							<br />
							<input
								type="text"
								value={dp}
								onChange={(e) => setDp(e.target.value)}
								placeholder="Profile Picture URL"
							/>
						</div>
						<div>
							<label>Email</label> <br />
							<br />
							<input
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder="Email"
								required
							/>
						</div>

						<div>
							<button type="submit">Update Profile</button>
						</div>
					</form>
					<button onClick={() => navigate('/user')}>Return</button>{' '}
				</>
			)}
		</>
	);
}
