import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../stylesheets/Login.module.css';
import UserContext from '../../context/UserContext';
import TokenContext from '../../context/TokenContext';
import ErrorContext from '../../context/ErrorContext';
import SocketContext from '../../context/SocketContext';
import { fetchUserInfo } from '../user/FetchUserInfo.cjs';
const serverUrl = import.meta.env.VITE_SERVER_URL;

export default function Login({ socket }) {
	const { accessToken, setAccessToken } = useContext(TokenContext);
	const { errorMessage, setErrorMessage } = useContext(ErrorContext);
	const { setSocketID } = useContext(SocketContext);
	const { setUserInfo } = useContext(UserContext);

	const [identification, setIdentification] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);

	const navigate = useNavigate();

	useEffect(() => {
		if (accessToken) {
			socket.on('connect', () => {
				console.log(`Connected with socket ID: ${socket.id}`);
				setSocketID(socket.id);
			});
		}

		return () => {
			socket.off('connect');
		};
	}, [accessToken, socket, setSocketID]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setErrorMessage(null);

		const trimmedValues = {
			identification: identification.trim(),
			password: password.trim(),
		};

		try {
			const response = await fetch(`${serverUrl}/api/users/login`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(trimmedValues),
			});

			if (!response.ok) {
				const errorData = await response.json();
				setErrorMessage(errorData.error);
				return;
			}
			const data = await response.json();
			setAccessToken(data.info.token);
			setUserInfo(await fetchUserInfo(data.info.user.id));
			navigate('/');

			setIdentification('');
			setPassword('');
		} catch (error) {
			console.error('Error during login request:', error);
			setErrorMessage('An unexpected error occurred.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			{loading ? (
				<h1 className={styles.loginH1}>Loading...</h1>
			) : (
				<div className={styles.container}>
					<h1 className={styles.loginH1}>We're glad you returned! :)</h1>
					<div className={styles.FormContainer}>
						<form onSubmit={handleSubmit}>
							<div className={styles.formDiv}>
								<label htmlFor="identification">Email or Username</label>
								<br />
								<input
									onChange={(e) => setIdentification(e.target.value)}
									type="text"
									name="identification"
									id="identification"
									required
									placeholder="johndoe@yahoo.com"
									value={identification}
								/>
							</div>
							<div className={styles.formDiv}>
								<label htmlFor="password">Password</label>
								<br />
								<input
									onChange={(e) => setPassword(e.target.value)}
									type="password"
									name="password"
									id="password"
									required
									placeholder="Enter your password"
									value={password}
								/>
							</div>
							<p style={{ color: 'red' }}>{errorMessage}</p>
							<button className={styles.loginButton}>Login</button>
						</form>
						<button
							className={styles.loginButton}
							onClick={() => {
								navigate('/signup');
							}}
						>
							Signup
						</button>
					</div>
				</div>
			)}
		</>
	);
}
