import React from 'react';
import { Form, Container, Button, Radio, Divider } from "semantic-ui-react";
import { useState } from 'react';
import axios from "axios";

function App() {

	const [file, setFile] = useState(null);
	const [gist, setGist] = useState(null);

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
				setGist(res.data);
			})
			.catch(err => console.error(err.response.data));
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
			})
			.catch(err => console.error(err.response.data));
	}

	return (
		<Container>
			{gist === null ?
				<Form onSubmit={handleFileSubmit}>
					<Form.Field>
						<label htmlFor="file">Submit the case File</label>
						<Divider />
						<input onChange={({ target }) => { setFile(target.files[0]) }} type="file" />
					</Form.Field>
					<Button type="submit">Submit</Button>
				</Form>
				:
				<Form onSubmit={handleGistUpdate}>
					<Form.Field>
						<label htmlFor="caseNumber">Case Number</label>
						<Divider />
						<input type="text" value={gist["caseNumber"]} name="caseNumber" onChange={({ target }) => updateGistPart(target.value, "caseNumber")} />
					</Form.Field>
					<Form.Field>
						<label htmlFor="accused">Accused</label>
						<Divider />
						<input type="text" value={gist["accused"]} name="accused" onChange={({ target }) => updateGistPart(target.value, "accused")} />
					</Form.Field>
					<Form.Field>
						<label htmlFor="prosecution">Prosecution</label>
						<Divider />
						<input type="text" value={gist["prosecution"]} name="prosecution" onChange={({ target }) => updateGistPart(target.value, "prosecution")} />
					</Form.Field>
					<Form.Field>
						<label htmlFor="victim">Victim</label>
						<Divider />
						<input type="text" value={gist["victim"]} name="victim" onChange={({ target }) => updateGistPart(target.value, "victim")} />
					</Form.Field>
					<Form.Field>
						<label htmlFor="accused">Penal Codes</label>
						<Divider />
						<input type="text" value={gist["penalCode"]} name="penalCode" onChange={({ target }) => updateGistPart(target.value, "penalCode")} />
					</Form.Field>
					<Form.Field>
						<label htmlFor="evidence">Evidence</label>
						<Divider />
						<Form.Field>
							<label htmlFor="evidenceFor">For(not guilty)</label>
							<input type="text" value={gist["evidence"].for} onChange={({ target }) => updateGistPart(target.value, "evidence", "for")} />
						</Form.Field>
						<Form.Field>
							<label htmlFor="evidenceAgainst">Against(guilty)</label>
							<input type="text" value={gist["evidence"].against} onChange={({ target }) => updateGistPart(target.value, "evidence", "against")} />
						</Form.Field>
					</Form.Field>
					<Form.Field>
						<label htmlFor="witness">Witness</label>
						<Divider />
						<Form.Field>
							<label htmlFor="witnessFor">For(not guilty)</label>
							<input type="number" value={gist["witness"] ? gist["witness"].for : 0} onChange={({ target }) => updateGistPart(target.value, "witness", "for")} />
						</Form.Field>
						<Form.Field>
							<label htmlFor="witnessAgainst">Against(guilty)</label>
							<input type="number" value={gist["witness"] ? gist["witness"].against : 0} onChange={({ target }) => updateGistPart(target.value, "witness", "against")} />
						</Form.Field>
					</Form.Field>
					<Form.Field>
						<label htmlFor="motive">Motive</label>
						<Divider />
						<Radio toggle checked={gist["motive"] | false} onChange={() => updateGistPart(!gist["motive"], "motive")} />
					</Form.Field>
					<Form.Field>
						<label htmlFor="means">Means</label>
						<Divider />
						<Radio toggle checked={gist["means"] | false} onChange={() => updateGistPart(!gist["means"], "means")} />
					</Form.Field>
					<Form.Field>
						<label htmlFor="opp">Opportunity</label>
						<Divider />
						<Radio toggle checked={gist["oppurtunity"] | false} onChange={() => updateGistPart(!gist["oppurtnity"], "oppurtunity")} />
					</Form.Field>
					<Form.Field>
						<label htmlFor="guilty">Guilty</label>
						<Divider />
						<Radio toggle checked={gist["guilty"] | false} onChange={() => updateGistPart(!gist["guilty"], "guilty")} />
					</Form.Field>
					<Button type="submit">Submit</Button>
				</Form>
			}

		</Container>
	);
}

export default App;