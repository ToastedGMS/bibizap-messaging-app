import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './login/Login.jsx';
import Logout from './Logout.jsx';
import UserProfile from './user/UserProfile.jsx';
import UpdateUser from './UpdateUser.jsx';
import Friends from './Friends.jsx';
import ChatCollection from './ChatCollection.jsx';
import Chat from './Chat.jsx';
import { io } from 'socket.io-client';
import Signup from './signup/Signup.jsx';
import Home from './Home.jsx';
import UserContext from '../context/UserContext.jsx';
import TokenContext from '../context/TokenContext.jsx';
import SocketContext from '../context/SocketContext.jsx';
import ErrorContext from '../context/ErrorContext.jsx';
const serverUrl = import.meta.env.VITE_SERVER_URL;
const socket = io(`${serverUrl}`);

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
									<Route path="/logout" element={<Logout />} />

									<Route path="/user" element={<UserProfile />} />

									<Route path="/user/update" element={<UpdateUser />} />

									<Route
										path="/user/friendships"
										element={<Friends socket={socket} />}
									/>

									<Route path="/chats" element={<ChatCollection />} />

									<Route
										path="/chats/chat"
										element={<Chat socket={socket} />}
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
