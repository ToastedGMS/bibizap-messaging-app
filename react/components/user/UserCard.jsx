import styles from '../../stylesheets/UserProfile.module.css';

export default function UserCard(userInfo) {
	return (
		<div className={styles.container}>
			{userInfo === null ? null : (
				<div className={styles.profileDiv}>
					<img src={userInfo.dp} alt={'User Profile Picture'} />
					<h2>@{userInfo.username}</h2>
					<p>{userInfo.bio}</p>
					<button
						className={styles.profileBtn}
						// onClick={() => navigate('/user/friendships')}
					>
						Friendships
					</button>
					<br />
					<br />
					<button
						className={styles.profileBtn}
						// onClick={() => navigate('/user/update')}
					>
						Edit Profile
					</button>
					<br />
					<br />
					<button
						className={styles.profileBtn}
						// onClick={() => navigate('/logout')}
					>
						Logout
					</button>
				</div>
			)}
		</div>
	);
}
