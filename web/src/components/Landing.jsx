import React from "react";
import { Container, List, Grid, Image } from "semantic-ui-react";
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
				<button disabled className="title">
					IDEAL
				</button>
				<div className="text">
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum, mollitia! Distinctio hic maxime magnam libero suscipit, error ex, corrupti inventore voluptatum quibusdam ducimus neque nihil ipsa. Hic architecto consequuntur saepe.
				</div>
			</div>
			<div>
				<button disabled className="title">
					REALITY
				</button>
				<div className="text">
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum, mollitia! Distinctio hic maxime magnam libero suscipit, error ex, corrupti inventore voluptatum quibusdam ducimus neque nihil ipsa. Hic architecto consequuntur saepe.
				</div>
			</div>
			<div>
				<button disabled className="title">
					SOLUTION
				</button>
				<div className="text">
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum, mollitia! Distinctio hic maxime magnam libero suscipit, error ex, corrupti inventore voluptatum quibusdam ducimus neque nihil ipsa. Hic architecto consequuntur saepe.
				</div>
				<span><Link to="/predict">Suggest notion</Link></span>
			</div>
		</Container>
	)

};

export default Page;

// https://www.dictionary.com/ --> meaning of words