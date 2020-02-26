import React from 'react';
import { Form, Container, Button, Radio, Divider, Grid } from "semantic-ui-react";
import FileInput from "./components/FileInput";
import { useState } from 'react';
import axios from "axios";

function App() {

	const [file, setFile] = useState(null);
	// const [gist, setGist] = useState({ "evidence": { "for": "", "against": "" }, "accused": " Sanjay Bachhulal Gupta, Salman Mohammed Jalil Ansari, Abbas Mustafa Lacche, Rakesh Suresh More ", "penalCode": "395, 397", "victim": "", "motive": false, "means": false, "oppurtunity": false, "guilty": false, "incomplete": true, "prosecution": "the state", "caseNumber": "14 / 2016", "id": "5e55e0f013de8602ff49de9a", "witness": {} });
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
				setTimeout(() => setGist(res.data), 2000);
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
				<FileInput handleFileChange={setFile} handleFileSubmit={handleFileSubmit} />
				:
				<Form onSubmit={handleGistUpdate}>
					<Grid columns="equal">
						<Grid.Row>
							<Grid.Column>
								<label htmlFor="caseNumber">Case Number</label>
							</Grid.Column>
							<Grid.Column width={10} >
								<input type="text" value={gist["caseNumber"]} name="caseNumber" onChange={({ target }) => updateGistPart(target.value, "caseNumber")} />
							</Grid.Column>
						</Grid.Row>
						<Divider />
						<Grid.Row>
							<Grid.Column>
								<label htmlFor="accused">Accused</label>
							</Grid.Column>
							<Grid.Column width={10} >
								<input type="text" value={gist["accused"]} name="accused" onChange={({ target }) => updateGistPart(target.value, "accused")} />
							</Grid.Column>
						</Grid.Row>
						<Divider />
						<Grid.Row>
							<Grid.Column>
								<label htmlFor="prosecution">Prosecution</label>
							</Grid.Column>
							<Grid.Column width={10} >
								<input type="text" value={gist["prosecution"]} name="prosecution" onChange={({ target }) => updateGistPart(target.value, "prosecution")} />
							</Grid.Column>
						</Grid.Row>
						<Divider />
						<Grid.Row>
							<Grid.Column>
								<label htmlFor="victim">Victim</label>
							</Grid.Column>
							<Grid.Column width={10} >
								<input type="text" value={gist["victim"]} name="victim" onChange={({ target }) => updateGistPart(target.value, "victim")} />
							</Grid.Column>
						</Grid.Row>
						<Divider />
						<Grid.Row>
							<Grid.Column>
								<label htmlFor="accused">Penal Codes</label>
							</Grid.Column>
							<Grid.Column width={10} >
								<input type="text" value={gist["penalCode"]} name="penalCode" onChange={({ target }) => updateGistPart(target.value, "penalCode")} />
							</Grid.Column>
						</Grid.Row>
						<Divider />
						<Grid.Row>
							<Grid.Column>
								<label htmlFor="motive">Motive</label>
							</Grid.Column>
							<Grid.Column>
								<Radio toggle checked={gist["motive"] | false} onChange={() => updateGistPart(!gist["motive"], "motive")} />
							</Grid.Column>
							<Grid.Column>
								<label htmlFor="means">Means</label>
							</Grid.Column>
							<Grid.Column>
								<Radio toggle checked={gist["means"] | false} onChange={() => updateGistPart(!gist["means"], "means")} />
							</Grid.Column>
							<Grid.Column>
								<label htmlFor="opp">Opportunity</label>
							</Grid.Column>
							<Grid.Column>
								<Radio toggle checked={gist["oppurtunity"] | false} onChange={() => updateGistPart(!gist["oppurtnity"], "oppurtunity")} />
							</Grid.Column>
						</Grid.Row>
						<Divider />
						<Grid.Row>
							<Grid.Column>
								<label htmlFor="evidence">Evidence</label>
							</Grid.Column>
							<Grid.Column>
								<label htmlFor="evidenceFor">For(not guilty)</label>
							</Grid.Column>
							<Grid.Column>
								<input type="text" value={gist["evidence"].for} onChange={({ target }) => updateGistPart(target.value, "evidence", "for")} />
							</Grid.Column>
							<Grid.Column>
								<label htmlFor="evidenceAgainst">Against(guilty)</label>
							</Grid.Column>
							<Grid.Column>
								<input type="text" value={gist["evidence"].against} onChange={({ target }) => updateGistPart(target.value, "evidence", "against")} />
							</Grid.Column>
						</Grid.Row>
						<Divider />
						<Grid.Row>
							<Grid.Column>
								<label htmlFor="witness">Witness</label>
							</Grid.Column>
							<Grid.Column>
								<label htmlFor="witnessFor">For(not guilty)</label>
							</Grid.Column>
							<Grid.Column>
								<input type="number" value={gist["witness"] ? gist["witness"].for : 0} onChange={({ target }) => updateGistPart(target.value, "witness", "for")} />
							</Grid.Column>
							<Grid.Column>
								<label htmlFor="witnessAgainst">Against(guilty)</label>
							</Grid.Column>
							<Grid.Column>
								<input type="number" value={gist["witness"] ? gist["witness"].against : 0} onChange={({ target }) => updateGistPart(target.value, "witness", "against")} />
							</Grid.Column>
						</Grid.Row>
						<Divider />
						<Grid.Row>
							<Grid.Column>
								<label htmlFor="guilty">Guilty</label>
							</Grid.Column>
							<Grid.Column>
								<Radio toggle checked={gist["guilty"] | false} onChange={() => updateGistPart(!gist["guilty"], "guilty")} />
							</Grid.Column>
						</Grid.Row>
						<Divider />
						<Grid.Row>
							<Button type="submit" style={{ backgroundColor: "green", color: "white" }}>Submit</Button>
						</Grid.Row>
					</Grid>
				</Form>
			}

		</Container>
	);
}

export default App;