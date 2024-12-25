import React from 'react';

const Message = ({ username, text }) => {
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
			<p className="message-username">{username}</p>
			<p className="message-text">{text}</p>
		</div>
	);
};

export default Message;
