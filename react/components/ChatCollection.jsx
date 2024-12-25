import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ChatCollection({ userInfoState, setErrorMessage }) {
	const { userInfo } = userInfoState;

	const navigate = useNavigate();

	useEffect(() => {
		if (userInfo === null) {
			console.log('userInfo', userInfo);
			setErrorMessage('Please login.');
			navigate('/login');
		}
	}, [userInfo, navigate, setErrorMessage]);

	return <></>;
}
