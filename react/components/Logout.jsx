import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Logout({ setAccessToken }) {
	const navigate = useNavigate();

	useEffect(() => {
		setAccessToken(null);
		navigate('/login');
	}, [setAccessToken, navigate]);

	return null;
}
