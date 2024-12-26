import React from 'react';
import { format } from 'date-fns';
import styles from '../stylesheets/Message.module.css';

const Message = ({ message, userInfo }) => {
	const { textContent, authorId, recipientId, chatId, createdAt, authorName } =
		message;

	return (
		<div
			className={`${
				authorId === userInfo.id ? styles.myMessage : styles.notMyMessage
			} ${styles.message}`}
		>
			<p>{textContent}</p>
			<p className={styles.timestamp}>
				{format(createdAt, 'HH:mm:ss dd/MM/yyyy')}
			</p>
		</div>
	);
};

export default Message;
