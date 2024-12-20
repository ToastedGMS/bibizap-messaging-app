import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import Login from './Login.jsx';
import Logout from './Logout.jsx';

const Root = () => {
	const [accessToken, setAccessToken] = useState(null);
	const [userInfo, setUserInfo] = useState(null);
	const [errorMessage, setErrorMessage] = useState(null);

	return (
		<StrictMode>
			<BrowserRouter>
				<Routes>
					<Route
						path="/"
						element={
							<App
								userInfo={userInfo}
								errorState={{ errorMessage, setErrorMessage }}
							/>
						}
					/>
					<Route
						path="/login"
						element={
							<Login
								tokenState={{ accessToken, setAccessToken }}
								setUserInfo={setUserInfo}
								errorState={{ errorMessage, setErrorMessage }}
							/>
						}
					/>
					<Route
						path="/logout"
						element={<Logout setAccessToken={setAccessToken} />}
					/>
				</Routes>
			</BrowserRouter>
		</StrictMode>
	);
};

createRoot(document.getElementById('root')).render(<Root />);
