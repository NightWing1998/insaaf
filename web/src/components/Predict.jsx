import React from 'react';
import { Container } from "semantic-ui-react"
import FileInput from "./FileInput";
import GistUpdateForm from "./GistUpdateForm";
import Notification from "./Notifications";
import useNotification from "../hooks/Notification";
import { useState } from 'react';
import axios from "axios";

import law_loading from "../law_loading.gif"

const Predict = props => {

	const [file, setFile] = useState(null);
	// const [gist, setGist] = useState({ "evidence": { "for": "", "against": "" }, "accused": " Sanjay Bachhulal Gupta, Salman Mohammed Jalil Ansari, Abbas Mustafa Lacche, Rakesh Suresh More ", "penalCode": "395, 397", "victim": "", "motive": false, "means": false, "oppurtunity": false, "guilty": false, "incomplete": true, "prosecution": "the state", "caseNumber": "14 / 2016", "id": "5e55e0f013de8602ff49de9a", "witness": {} });
	const [gist, setGist] = useState(null);
	const [loading, setLoading] = useState(false);

	const [msg, createMsg] = useNotification();

	const [result,setResult] = useState(null);

	if(props.medium !== "predict" && props.medium !== "train"){
		return <></>;
	}

	const handleFileSubmit = e => {
		e.preventDefault();
		if (file === null) return;

		setLoading(true);

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
				res.data.prosecution = res.data.prosecution.join(",");
				console.log(res.data);
				// console.log(Object.keys(res.data["evidence"]["for"]).map(evidence => [evidence,res.data["evidence"]["for"][evidence]]))
				setTimeout(() => {
					setLoading(false);
					setGist(res.data);
					createMsg(5000, "Case details successfully extracted!", "success", true);
				}, 5000);
			})
			.catch(err => {
				setLoading(false);
				console.log(err.response.data,err.response.data.message);
				createMsg(5000, err.response.data, "failure", true);
			});
	}

	const updateGistPart = (newval, target1, target2,target3) => {
		const newGist = { ...gist };
		if (target1 === "evidence" && target2 && target3) {
			newGist[target1][target2][target3] = parseInt(newval);
		} else if(target1 === "evidence" && target2 && !target3) {
			newGist[target1][target2] = newval;
		} else {
			newGist[target1] = newval;
		}
		setGist(newGist);
	}

	const handleGistUpdateAndPredict = e => {
		e.preventDefault();
		setLoading(true);
		const data = { ...gist };
		data.accused = data.accused.split(",");
		data.penalCode = data.penalCode.split(",");
		data.penalCode = data.penalCode.map(pc => parseInt(pc));
		data.victim = data.victim.split(",");
		data.prosecution = data.prosecution.split(",");
		console.log(data);
		axios.put(`/api/intelligence/${props.medium}/${data.id}`, data)
			.then(res => {
				console.log(res.data);
				setTimeout(() => {
					setLoading(false);
					setResult(res.data);
				},5000);
			})
			.catch(err => {
				setLoading(false);
				console.error(err.response.data)
				createMsg(5000, err.response.data, "failure", true);
			});
	}



	return (
		<Container>
			{
				loading?
				// <img src="https://tenor.com/view/scale-opposites-maybe-balance-gif-5526735" alt="Loading" />
				<center>
					<img src={law_loading} alt="Loading" style={{marginTop: "30vh"}} />
				</center>
				:
				<>
					{msg.message !== null ? <Notification {...msg} /> : <></>}
					{gist === null ?
						<FileInput handleFileChange={setFile} handleFileSubmit={handleFileSubmit} err={msg.category === "failure" ? true : false} />
						:
							result === null?
							<GistUpdateForm {...props} handleGistUpdate={handleGistUpdateAndPredict} updateGistPart={updateGistPart} gist={{...gist}} />
							:
							<Container>
								{result}
							</Container>
					}
				</>
			}

		</Container>
	);

}

export default Predict;