import React from 'react';
import { Container } from "semantic-ui-react"
import FileInput from "./FileInput";
import GistUpdateForm from "./GistUpdateForm";
import Notification from "./Notifications";
import useNotification from "../hooks/Notification";
import { useState } from 'react';
import axios from "axios";

const Predict = props => {

	const [file, setFile] = useState(null);
	const [gist, setGist] = useState(null);

	const [msg, createMsg] = useNotification();

	const handleFileSubmit = e => {
		e.preventDefault();
		if (file === null) return;
		let formData = new FormData();
		formData.append("case", file);
		axios.post("/api/case", formData, {
			headers: {
				'content-type': 'multipart/form-data'
			}
		})
			.then(res => {
				res.data.accused = res.data.accused.join(",");
				res.data.penalCode = res.data.penalCode.join(",");
				res.data.victim = res.data.victim.join(",");
				res.data.evidence.for = res.data.evidence.for.join(",");
				res.data.evidence.against = res.data.evidence.against.join(",");
				res.data.witness = res.data.witness || {}
				console.log(res.data);
				setTimeout(() => {
					setGist(res.data);
					createMsg(5000, "Case details successfully extracted!", "success", true);
				}, 2000);
			})
			.catch(err => {
				console.error(err.response.data);
				createMsg(5000, err.response.data, "failure", true);
			});
	}

	const updateGistPart = (newval, target1, target2) => {
		const newGist = { ...gist };
		if (target1 === "evidence" || target1 === "witness") {
			newGist[target1][target2] = newval;
		} else {
			newGist[target1] = newval;
		}
		setGist(newGist);
	}

	const handleGistUpdate = async e => {
		e.preventDefault();
		const data = { ...gist };
		data.accused = data.accused.split(",");
		data.penalCode = data.penalCode.split(",");
		data.penalCode = data.penalCode.map(pc => parseInt(pc));
		data.victim = data.victim.split(",");
		data.evidence.for = data.evidence.for.toLowerCase();
		data.evidence.against = data.evidence.against.toLowerCase();
		data.evidence.for = data.evidence.for.split(",");
		data.evidence.against = data.evidence.against.split(",");
		console.log(data);
		axios.put(`/api/case/${data.id}`, data)
			.then(res => {
				res.data.accused = res.data.accused.join(",");
				res.data.penalCode = res.data.penalCode.join(",");
				res.data.victim = res.data.victim.join(",");
				res.data.evidence.for = res.data.evidence.for.join(",");
				res.data.evidence.against = res.data.evidence.against.join(",");
				res.data.witness = res.data.witness || {}
				console.log(res.data);
				setGist(res.data);
				axios.post(`/api/intelligence/train`).catch(() => { });
			})
			.catch(err => console.error(err.response.data));
	}



	return (
		<Container>
			{msg.message !== null ? <Notification {...msg} /> : <></>}
			{gist === null ?
				<FileInput handleFileChange={setFile} handleFileSubmit={handleFileSubmit} err={msg.category === "failure" ? true : false} />
				:
				<GistUpdateForm medium="predict" handleGistUpdate={handleGistUpdate} updateGistPart={updateGistPart} gist={{...gist}} />
			}

		</Container>
	);

}

export default Predict;