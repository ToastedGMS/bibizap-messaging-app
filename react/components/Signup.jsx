import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../stylesheets/Signup.module.css';

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

		try {
			const response = await fetch('http://192.168.1.28:4000/api/users/new', {
				method: 'POST',
				headers: {
					'Content-Type': 'Application/JSON',
				},
				body: JSON.stringify({
					email,
					password,
					username,
				}),
			});

			if (!response.ok) {
				const errorData = await response.json();
				setErrorMessage(errorData.error);
				return;
			}

			const data = await response.json();
			console.log('User created:', data.user);

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
				<h1>Loading...</h1>
			) : (
				<div className={styles.container}>
					<h1>Signup</h1>
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
