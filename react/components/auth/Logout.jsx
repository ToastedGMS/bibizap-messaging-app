import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TokenContext from '../../context/TokenContext';

export default function Logout() {
	const navigate = useNavigate();
	const { setAccessToken } = useContext(TokenContext);

	useEffect(() => {
		setAccessToken(null);
		navigate('/login');
	}, [setAccessToken, navigate]);

	return null;
}
