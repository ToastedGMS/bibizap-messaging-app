import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../stylesheets/UpdateUser.module.css';
import UserContext from '../../context/UserContext';
import TokenContext from '../../context/TokenContext';
import ErrorContext from '../../context/ErrorContext';
const serverUrl = import.meta.env.VITE_SERVER_URL;

export default function UpdateUser() {
	const { userInfo, setUserInfo } = useContext(UserContext);
	const { accessToken } = useContext(TokenContext);
	const { setErrorMessage } = useContext(ErrorContext);

	const [username, setUsername] = useState('');
	const [bio, setBio] = useState('');
	const [dp, setDp] = useState('');
	const [email, setEmail] = useState('');

	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);

	const [file, setFile] = useState(null);

	const handleFileChange = (e) => {
		setFile(e.target.files[0]);
	};

	useEffect(() => {
		if (userInfo === null || userInfo === undefined) {
			setErrorMessage('Please login.');
			navigate('/login');
			return;
		}
	}, [userInfo]);

	useEffect(() => {
		if (userInfo) {
			setUsername(userInfo.username);
			setBio(userInfo.bio);
			setEmail(userInfo.email);
			setDp(userInfo.dp);
		}
	}, [userInfo]);

	const handleUpload = async () => {
		if (!file) return;

		const formData = new FormData();
		formData.append('file', file);

		try {
			const response = await fetch(`${serverUrl}/api/upload`, {
				method: 'POST',
				body: formData,
			});

			if (!response.ok) {
				const errorText = await response.text();
				setErrorMessage(`Error uploading file: ${errorText}`);
				return;
			}

			const result = await response.json();
			setDp(result.fileUrl); // Automatically set the profile picture URL after upload
		} catch (error) {
			console.error('Error uploading file:', error);
			setErrorMessage('Failed to upload file.');
		}
	};

	useEffect(() => {
		if (file) {
			handleUpload();
		}
	}, [file]);

	const updateUserInfo = async (e) => {
		e.preventDefault();
		setLoading(true);

		const updatedUserInfo = {
			username: username.trim(),
			bio: bio.trim(),
			dp: dp.trim(),
			email: email.trim(),
		};

		try {
			const response = await fetch(`${serverUrl}/api/users/${userInfo.id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${accessToken}`,
				},
				body: JSON.stringify(updatedUserInfo),
			});

			if (!response.ok) {
				setErrorMessage('Failed to update user info');
				return;
			}

			const data = await response.json();
			setUserInfo(data.updatedUser);
			navigate('/user');
		} catch (error) {
			console.error('Error updating user data:', error);
			setErrorMessage('An error occurred while updating your profile.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			{loading ? (
				<h1>Loading...</h1>
			) : (
				<div className={styles.container}>
					<div className={styles.FormContainer}>
						<form onSubmit={updateUserInfo}>
							<div className={styles.formDiv}>
								<label>Username</label>
								<input
									type="text"
									value={username}
									onChange={(e) => setUsername(e.target.value)}
									placeholder="Username"
									pattern="^[A-Za-z0-9]+$"
									required
									minLength={4}
									maxLength={16}
								/>
							</div>
							<br />
							<div className={styles.formDiv}>
								<label>Profile Picture</label>
								<input
									type="file"
									accept="image/jpg, image/png, image/webp, image/jpeg"
									onChange={handleFileChange}
								/>
								{dp && (
									<img
										src={dp}
										alt="Profile preview"
										className={styles.preview}
									/>
								)}
							</div>
							<br />
							<div className={styles.formDiv}>
								<label>Bio</label>
								<textarea
									value={bio}
									onChange={(e) => setBio(e.target.value)}
									maxLength={140}
									placeholder="Bio"
								/>
							</div>{' '}
							<br />
							<div className={styles.formDiv}>
								<label>Email</label>
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
							<button className={styles.profileBtn} type="submit">
								Update Profile
							</button>
						</form>
						<button
							className={styles.profileBtn}
							onClick={() => navigate('/user')}
						>
							Return
						</button>
					</div>
				</div>
			)}
		</>
	);
}
