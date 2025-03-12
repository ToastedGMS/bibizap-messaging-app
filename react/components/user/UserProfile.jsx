import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUserInfo } from './FetchUserInfo.cjs';
import UserCard from './UserCard';

export default function UserProfile({ userInfoState, setErrorMessage }) {
	const navigate = useNavigate();
	const { userInfo, setUserInfo } = userInfoState;

	useEffect(() => {
		if (userInfo === null) {
			setErrorMessage('Please login.');
			navigate('/login');
			return;
		}
		async function setInfo() {
			setUserInfo(await fetchUserInfo(userInfo.id));
		}

		setInfo();
	}, [userInfo, setErrorMessage]);

	return <UserCard userInfo={userInfo} />;
}
