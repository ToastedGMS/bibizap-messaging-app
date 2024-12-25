import React from 'react';

const Message = ({ message }) => {
	const { textContent, authorId, recipientId, chatId, createdAt, authorName } =
		message;

	return (
		<div
			className="message"
			style={{
				border: '1px solid black',
				borderRadius: '15px',
				maxWidth: 'fit-content',
				paddingLeft: '2em',
				paddingRight: '2em',
			}}
		>
			<h4>{authorName}</h4>
			<p>{textContent}</p>
			<p>{createdAt}</p>
		</div>
	);
};

export default Message;
