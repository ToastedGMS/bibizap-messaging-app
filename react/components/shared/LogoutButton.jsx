import { useNavigate } from 'react-router-dom';

export default function LogoutButton() {
	const navigate = useNavigate();
	return <button onClick={() => navigate('/logout')}>Logout</button>;
}
