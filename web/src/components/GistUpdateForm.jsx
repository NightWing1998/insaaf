import React from "react";
import { Form, Radio, Divider, Grid } from "semantic-ui-react";

const GistUpdateComponent = ({medium, handleGistUpdate, updateGistPart, gist}) => {
	const constantRender = (
		<>
				<Grid.Row>
					<Grid.Column>
						<label htmlFor="caseNumber">Case Number</label>
					</Grid.Column>
					<Grid.Column width={5} >
						<input className="inp" type="text" value={gist["caseNumber"]} name="caseNumber" onChange={({ target }) => updateGistPart(target.value, "caseNumber")} />
					</Grid.Column>
					<Grid.Column>
						<label htmlFor="caseStart">Case Number</label>
					</Grid.Column>
					<Grid.Column width={5} >
						<input className="inp" type="text" value={gist["caseStart"]} name="caseStart" onChange={({ target }) => updateGistPart(target.value, "caseStart")} />
					</Grid.Column>
				</Grid.Row>
				<Divider />
				<Grid.Row>
					<Grid.Column>
						<label htmlFor="accused">Accused</label>
					</Grid.Column>
					<Grid.Column width={10} >
						<input className="inp" type="text" value={gist["accused"]} name="accused" onChange={({ target }) => updateGistPart(target.value, "accused")} />
					</Grid.Column>
				</Grid.Row>
				<Divider />
				<Grid.Row>
					<Grid.Column>
						<label htmlFor="prosecution">Prosecution</label>
					</Grid.Column>
					<Grid.Column width={10} >
						<input className="inp" type="text" value={gist["prosecution"]} name="prosecution" onChange={({ target }) => updateGistPart(target.value, "prosecution")} />
					</Grid.Column>
				</Grid.Row>
				<Divider />
				<Grid.Row>
					<Grid.Column>
						<label htmlFor="victim">Victim</label>
					</Grid.Column>
					<Grid.Column width={10} >
						<input className="inp" type="text" value={gist["victim"]} name="victim" onChange={({ target }) => updateGistPart(target.value, "victim")} />
					</Grid.Column>
				</Grid.Row>
				<Divider />
				<Grid.Row>
					<Grid.Column>
						<label htmlFor="accused">Penal Codes</label>
					</Grid.Column>
					<Grid.Column width={10} >
						<input className="inp" type="text" value={gist["penalCode"]} name="penalCode" onChange={({ target }) => updateGistPart(target.value, "penalCode")} />
					</Grid.Column>
				</Grid.Row>
				<Divider />
				<Grid.Row>
					<Grid.Column>
						<label htmlFor="motive">Motive</label>
					</Grid.Column>
					<Grid.Column>
						<Radio toggle checked={gist["motive"] || false} onChange={() => updateGistPart(!gist["motive"], "motive")} />
					</Grid.Column>
					<Grid.Column>
						<label htmlFor="means">Means</label>
					</Grid.Column>
					<Grid.Column>
						<Radio toggle checked={gist["means"] || false} onChange={() => updateGistPart(!gist["means"], "means")} />
					</Grid.Column>
					<Grid.Column>
						<label htmlFor="opp">Opportunity</label>
					</Grid.Column>
					<Grid.Column>
						<Radio toggle checked={gist["oppurtunity"] || false} onChange={() => updateGistPart(!gist["oppurtnity"], "oppurtunity")} />
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
						<input className="inp" type="text" value={gist["evidence"].for} onChange={({ target }) => updateGistPart(target.value, "evidence", "for")} />
					</Grid.Column>
					<Grid.Column>
						<label htmlFor="evidenceAgainst">Against(guilty)</label>
					</Grid.Column>
					<Grid.Column>
						<input className="inp" type="text" value={gist["evidence"].against} onChange={({ target }) => updateGistPart(target.value, "evidence", "against")} />
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
						<input className="inp" type="number" value={gist["witness"] ? gist["witness"].for : 0} onChange={({ target }) => updateGistPart(target.value, "witness", "for")} />
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
					<button className="btn" type="submit" >Predict</button>
				</Grid.Row>
			</>
	)


	return (
		<div>
			<Form onSubmit={handleGistUpdate} style={{ margin: "5rem" }}>
				<Grid columns="equal">
					{constantRender}

					{
						medium === "train"?
							<>
								<Grid.Column>
									<label htmlFor="guilty">Guilty</label>
								</Grid.Column>
								<Grid.Column>
									<Radio toggle checked={gist["guilty"] || false} onChange={() => updateGistPart(!gist["guilty"], "guilty")} />
								</Grid.Column>
							</>
						:
						<></>
					}

				</Grid>
			</Form>
		</div>
	);
};

export default GistUpdateComponent;