import React from "react";
import { Form, Radio, Divider, Grid } from "semantic-ui-react";

const GistUpdateComponent = ({medium, handleGistUpdate, updateGistPart, gist}) => {
	const constantRender = (
		<>
			<Grid.Row>
				<Grid.Column>
					<label htmlFor="caseNumber">Case Number</label>
				</Grid.Column>
				<Grid.Column width={6} >
					<input className="inp" type="text" value={gist["caseNumber"]} name="caseNumber" onChange={({ target }) => updateGistPart(target.value, "caseNumber")} />
				</Grid.Column>
				
				<Grid.Column>
					<label htmlFor="caseStart">Case Start</label>
				</Grid.Column>
				<Grid.Column width={6} >
						<input className="inp" type="text" value={gist["caseStart"]} name="caseStart" onChange={({ target }) => updateGistPart(target.value, "caseStart")} />
				</Grid.Column>

			</Grid.Row>
			
			<Divider />
				
			<Grid.Row>
					
				<Grid.Column>
					<label htmlFor="accused">Accused</label>
				</Grid.Column>
				
				<Grid.Column width={12} >
					<input className="inp" type="text" value={gist["accused"]} name="accused" onChange={({ target }) => updateGistPart(target.value, "accused")} />
				</Grid.Column>
				
			</Grid.Row>
			
			<Divider />
			
			<Grid.Row>
			
				<Grid.Column>
					<label htmlFor="prosecution">Prosecution</label>
				</Grid.Column>
			
				<Grid.Column width={12} >
					<input className="inp" type="text" value={gist["prosecution"]} name="prosecution" onChange={({ target }) => updateGistPart(target.value, "prosecution")} />
				</Grid.Column>
			
			</Grid.Row>
			
			<Divider />
			
			<Grid.Row>
			
				<Grid.Column>
					<label htmlFor="victim">Victim</label>
				</Grid.Column>
			
				<Grid.Column width={12} >
					<input className="inp" type="text" value={gist["victim"]} name="victim" onChange={({ target }) => updateGistPart(target.value, "victim")} />
				</Grid.Column>
			
			</Grid.Row>
			
			<Divider />
			
			<Grid.Row>
			
				<Grid.Column>
					<label htmlFor="accused">Penal Codes</label>
				</Grid.Column>
			
				<Grid.Column width={12} >
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

				</Grid.Row>

				<Grid.Row>

					<Grid.Column>
						<div>For(not guilty)</div>
						<br />
							{
								Object.keys(gist["evidence"]["for"]).map(evidence => (
										<div key={evidence} className="evidence">
											
											<label htmlFor={evidence}>{evidence}</label>
											<input className="inp" type="number" value={gist["evidence"]["for"][evidence]} name={evidence} onChange={({ target }) => updateGistPart(target.value, "evidence","for",evidence)} />

										</div>
								))
							}
						
					</Grid.Column>
					
					<Grid.Column>
						<div>Against(guilty)</div>
						<br/>

							{
								Object.keys(gist["evidence"]["against"]).map(evidence => (
									<div className="evidence" key={evidence} >
										
										<label htmlFor={evidence}>{evidence}</label>
										<input className="inp" type="number" value={gist["evidence"]["against"][evidence]} name={evidence} onChange={({ target }) => updateGistPart(target.value, "evidence","against",evidence)} />
										
										<br/>
									</div>
								))
							}
					</Grid.Column>
					
				</Grid.Row>
				
			
			<Divider />
			
		</>
	)


	return (
		<div>
			<Form onSubmit={handleGistUpdate} style={{ margin: "5rem" }}>
				<Grid columns="equal" doubling>
					{constantRender}

					{
						medium === "train"?
							<Grid.Row>
								<Grid.Column>
									<label htmlFor="guilty">Guilty</label>
								</Grid.Column>
								<Grid.Column>
									<Radio toggle checked={gist["guilty"] || false} onChange={() => updateGistPart(!gist["guilty"], "guilty")} />
								</Grid.Column>
							</Grid.Row>
						:
						<></>
					}

					<Grid.Row textAlign="center">
						
						<Grid.Column>
							<button className="btn" type="submit" >
								{medium === "predict"? "Predict": "Train"}
							</button>
						</Grid.Column>
						
					</Grid.Row>

				</Grid>
			</Form>
		</div>
	);
};

export default GistUpdateComponent;