import { useState } from "react";

const useNotification = () => {
	const [msg, setMsg] = useState({
		message: null
	});

	const createNotification = (timeout, value, cat, h, c) => {
		console.log("@@", value, cat, h, c);
		if (value === null) throw new Error(`argument "value" cannot be null for createNotification`);
		setMsg({
			message: value,
			category: cat,
			header: h,
			children: c
		});
		setTimeout(() => {
			setMsg({
				message: null
			});
		}, timeout);

	}

	return [msg, createNotification];

}

export default useNotification;