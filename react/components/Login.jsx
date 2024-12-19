import React, { useEffect, useState } from 'react';

export default function Login({ tokenState }) {
	const [identification, setIdentification] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState(null);
	const { accessToken, setAccessToken } = tokenState;

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setErrorMessage(null);

		try {
			const response = await fetch('http://localhost:4000/api/users/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'Application/JSON',
				},
				body: JSON.stringify({
					identification,
					password,
				}),
			});

			if (!response.ok) {
				const errorData = await response.json();
				setErrorMessage(errorData.error);
				return;
			}

			const data = await response.json();
			setAccessToken(data.info.token);

			setIdentification('');
			setPassword('');
		} catch (error) {
			console.error('Error during login request:', error);
			setErrorMessage('An unexpected error occurred.');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		console.log('token', accessToken);
	}, [accessToken]);

	return (
		<>
			{loading ? (
				<h1>Loading...</h1>
			) : (
				<div>
					<form onSubmit={handleSubmit}>
						<div>
							<label htmlFor="identification">Email or Username</label>
							<input
								onChange={(e) => setIdentification(e.target.value)}
								type="text"
								name="identification"
								id="identification"
								required
								placeholder="Enter email or username"
								value={identification}
							/>
						</div>
						<div>
							<label htmlFor="password">Password</label>
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
						<button>Login</button>
					</form>
				</div>
			)}
		</>
	);
}
