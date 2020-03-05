import { Message } from "semantic-ui-react";
import React from "react";

const Notification = props => {
	const { message, category, header, children } = props;
	console.log("##", props);

	if (message === null) return <></>;
	else if (category === "success") {
		return <Message positive>
			{props.header ?
				<Message.Header>{message}</Message.Header>
				:
				message
			}
			{children ? children : <></>}
		</Message>
	} else if (category === "failure") {
		return <Message negative>
			{header ?
				<Message.Header>{message}</Message.Header>
				:
				message
			}
			{children ? children : <></>}
		</Message>
	} else return <></>;
}

export default Notification;