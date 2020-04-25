import React from "react";
import { Container, List, Grid, Image, Icon } from "semantic-ui-react";
import { Link } from "react-router-dom";
import "../App.css";

import blindJustice from "../blindJustice.jpeg";

const Page = props => {

	return (
		<Container className="landing">
			<List verticalAlign="bottom">
				<Grid columns="equal">
					<Grid.Column>
						<List.Item className="acro">
							<span className="extra-large">I</span>mpartial
								<List.List className="acro-text">
								<List.Item>We don't differentiate between any person on the basis of their caste, religion, sex or financial status.</List.Item>
							</List.List>
						</List.Item>
						<List.Item className="acro">
							<span className="extra-large">N</span>otion
								<List.List className="acro-text">
								<List.Item>A vague or imperfect conception or idea of something or an opinion, view, or belief</List.Item>
							</List.List>
						</List.Item>
						<List.Item className="acro">
							<span className="extra-large">S</span>uggesting
								<List.List className="acro-text">
								<List.Item>We strongly suggest a notion and nothing more. Complying with it is not our call.</List.Item>
							</List.List>
						</List.Item>
						<List.Item className="acro">
							<span className="extra-large">A</span>nd
						</List.Item>
						<List.Item className="acro">
							<span className="extra-large">A</span>stute
							<List.List className="acro-text">
								<List.Item>Clever | Cunning | Ingenious | Shrewd. As we are training a machine to perform evaluating tasks concerning a case</List.Item>
							</List.List>
						</List.Item>
						<List.Item className="acro">
							<span className="extra-large">F</span>unctioning
						</List.Item>
						<List.Item>
							<span>Companion</span>
							<List.List className="acro-text">
								<List.Item>In short we provide assistance to the judges of court of laws pass notions and orders for their cases.</List.Item>
							</List.List>
						</List.Item>
					</Grid.Column>
					<Grid.Column>
						<Image size="big" src={blindJustice} />
					</Grid.Column>
				</Grid>
			</List>
			<div>
				<div style={{margin: "1rem 0"}}>
					<span className="title underline">IDEAL</span>
				</div>
				<div className="text">
					Court cases are judicial matters and as it's rightly said: "Justice delayed is justice denied". Court cases should deliver an unbiased judgement such that it is righteous to all the parties involved.
				</div>
			</div>
			<div>
				<div style={{margin: "1rem 0"}}>
					<span className="title underline">
					REALITY
					</span>
				</div>
				<div className="text">
					There are in all 3.3 crore cases pending in India by August 2019. There aren’t enough judges per case to lighten this backlog and the situation is just exacerbating.
				</div>
			</div>
			<div>
				<div style={{margin: "1rem 0"}}>
					<span className="title underline">
					SOLUTION
					</span>
				</div>
				<div className="text">
					To build an autonomous intelligent system that could help the judge label a person guilty, not guilty or need more evidence and suggest a suitable notion for the same. The judge can further accept or reject the notion.
				</div>
			</div>

			<button className="btn">
				<Link to="/predict" style={{ color: "inherit" }}>
					<span style={{ color: "inherit" }}>
						Get Started <Icon name="angle double right" />
					</span>
				</Link>
			</button>

		</Container>
	)

};

export default Page;

// https://www.dictionary.com/ --> meaning of words