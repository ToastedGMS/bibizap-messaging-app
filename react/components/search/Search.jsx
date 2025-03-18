import styles from '../../stylesheets/Friends.module.css';
export default function Search({
	targetUserName,
	setTargetUserName,
	sendingRequest,
	handleSendRequest,
}) {
	return (
		<div className={styles.sendFriendRequest}>
			<h3>Send Friend Request</h3>
			<input
				type="text"
				placeholder="Enter username"
				value={targetUserName}
				onChange={(e) => setTargetUserName(e.target.value)}
			/>
			<button
				className={styles.friendBtn}
				onClick={handleSendRequest}
				disabled={sendingRequest}
			>
				{sendingRequest ? 'Sending...' : 'Send Request'}
			</button>
		</div>
	);
}
