import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUserInfo } from './FetchUserInfo.cjs';
import UserCard from './UserCard';
import UserContext from '../../context/UserContext';
import ErrorContext from '../../context/ErrorContext';

export default function UserProfile() {
	const navigate = useNavigate();
	const { userInfo, setUserInfo } = useContext(UserContext);
	const { setErrorMessage } = useContext(ErrorContext);

	useEffect(() => {
		if (userInfo === null || userInfo === undefined) {
			setErrorMessage('Please login.');
			navigate('/login');
			return;
		}
		async function setInfo() {
			try {
				setUserInfo(await fetchUserInfo(userInfo.id));
			} catch (error) {
				setErrorMessage(error.message);
				console.error(error);
			}
		}

		setInfo();
	}, [setUserInfo, userInfo]);

	return userInfo && userInfo.dp ? (
		<UserCard userInfo={userInfo} />
	) : (
		<h1>Loading...</h1>
	);
}
