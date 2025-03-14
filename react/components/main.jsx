import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Login.jsx';
import Logout from './Logout.jsx';
import UserProfile from './user/UserProfile.jsx';
import UpdateUser from './UpdateUser.jsx';
import Friends from './Friends.jsx';
import ChatCollection from './ChatCollection.jsx';
import Chat from './Chat.jsx';
import { io } from 'socket.io-client';
import Signup from './Signup.jsx';
import Home from './Home.jsx';
import UserContext from '../context/UserContext.jsx';
import TokenContext from '../context/TokenContext.jsx';
import SocketContext from '../context/SocketContext.jsx';
import ErrorContext from '../context/ErrorContext.jsx';
const socket = io('http://192.168.1.28:4000');

const Root = () => {
	const [accessToken, setAccessToken] = useState(null);
	const [userInfo, setUserInfo] = useState(null);
	const [errorMessage, setErrorMessage] = useState(null);
	const [socketID, setSocketID] = useState(null);

	return (
		<StrictMode>
			<UserContext.Provider value={{ userInfo, setUserInfo }}>
				<TokenContext.Provider value={{ accessToken, setAccessToken }}>
					<ErrorContext.Provider value={{ errorMessage, setErrorMessage }}>
						<SocketContext.Provider value={{ socketID, setSocketID }}>
							<BrowserRouter>
								<Routes>
									<Route path="/" element={<Home />} />
									<Route path="/signup" element={<Signup />} />

									<Route path="/login" element={<Login socket={socket} />} />
									<Route
										path="/logout"
										element={<Logout setAccessToken={setAccessToken} />}
									/>

									<Route
										path="/user"
										element={
											<UserProfile
												userInfoState={{ userInfo, setUserInfo }}
												setErrorMessage={setErrorMessage}
											/>
										}
									/>

									<Route
										path="/user/update"
										element={
											<UpdateUser
												userInfoState={{ userInfo, setUserInfo }}
												setErrorMessage={setErrorMessage}
												accessToken={accessToken}
											/>
										}
									/>

									<Route
										path="/user/friendships"
										element={
											<Friends
												userInfoState={{ userInfo, setUserInfo }}
												setErrorMessage={setErrorMessage}
												accessToken={accessToken}
												socketID={socketID}
												socket={socket}
											/>
										}
									/>

									<Route
										path="/chats"
										element={
											<ChatCollection
												accessToken={accessToken}
												userInfoState={{ userInfo, setUserInfo }}
												setErrorMessage={setErrorMessage}
											/>
										}
									/>

									<Route
										path="/chats/chat"
										element={
											<Chat
												accessToken={accessToken}
												userInfoState={{ userInfo, setUserInfo }}
												setErrorMessage={setErrorMessage}
												socket={socket}
												socketID={socketID}
											/>
										}
									/>
								</Routes>
							</BrowserRouter>
						</SocketContext.Provider>
					</ErrorContext.Provider>
				</TokenContext.Provider>
			</UserContext.Provider>
		</StrictMode>
	);
};

createRoot(document.getElementById('root')).render(<Root />);
