import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../stylesheets/Signup.module.css';
const serverUrl = import.meta.env.VITE_SERVER_URL;

export default function Signup() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [username, setUsername] = useState('');
	const [loading, setLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState(null);

	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setErrorMessage(null);

		const trimmedValues = {
			email: email.trim(),
			password: password.trim(),
			username: username.trim(),
		};

		try {
			const response = await fetch(`${serverUrl}/api/users/new`, {
				method: 'POST',
				headers: {
					'Content-Type': 'Application/JSON',
				},
				body: JSON.stringify(trimmedValues),
			});

			if (!response.ok) {
				const errorData = await response.json();
				setErrorMessage(errorData.error);
				return;
			}

			const data = await response.json();
			navigate('/login');

			setEmail('');
			setPassword('');
			setUsername('');
		} catch (error) {
			console.error('Error during signup request:', error);
			setErrorMessage('An unexpected error occurred.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			{loading ? (
				<h1 className={styles.signupH1}>Loading...</h1>
			) : (
				<div className={styles.container}>
					<h1 className={styles.signupH1}>Signup</h1>
					<div className={styles.FormContainer}>
						<form onSubmit={handleSubmit}>
							<div className={styles.formDiv}>
								<label htmlFor="email">Email</label>
								<br />
								<input
									onChange={(e) => setEmail(e.target.value)}
									type="email"
									name="email"
									id="email"
									pattern="^[a-zA-Z0-9._%+-]+@require\.com$"
									required
									placeholder="Enter your email"
									value={email}
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
									minLength={8}
								/>
							</div>
							<div className={styles.formDiv}>
								<label htmlFor="username">Username</label>
								<br />
								<input
									onChange={(e) => setUsername(e.target.value)}
									type="text"
									name="username"
									id="username"
									required
									placeholder="Enter your username"
									value={username}
									minLength={4}
									maxLength={16}
								/>
							</div>
							<p style={{ color: 'red' }}>{errorMessage}</p>
							<button className={styles.signUpButton} type="submit">
								Signup
							</button>
						</form>
						<button
							className={styles.signUpButton}
							onClick={() => {
								navigate('/login');
							}}
						>
							Login
						</button>
					</div>
				</div>
			)}
		</>
	);
}
