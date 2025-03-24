import React, { useContext, useEffect } from 'react';
import UserContext from '../context/UserContext';
import ErrorContext from '../context/ErrorContext';
import UserCard from './user/UserCard';
import { useNavigate } from 'react-router-dom';

export default function Home() {
	const { setErrorMessage } = useContext(ErrorContext);
	const { userInfo } = useContext(UserContext);
	const navigate = useNavigate();

	useEffect(() => {
		if (userInfo === null || userInfo === undefined) {
			setErrorMessage('Please login.');
			navigate('/login');
			return;
		}
	}, [userInfo]);

	return <UserCard userInfo={userInfo} />;
}
