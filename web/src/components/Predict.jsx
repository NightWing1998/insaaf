import React from "react";
import { Container, Grid, Icon, Divider, Responsive } from "semantic-ui-react";
import { Link } from "react-router-dom";
import FileInput from "./FileInput";
import GistUpdateForm from "./GistUpdateForm";
import Notification from "./Notifications";
import useNotification from "../hooks/Notification";
import { useState } from "react";
import axios from "axios";

import law_loading from "../law_loading.gif";

const Predict = (props) => {
	const [file, setFile] = useState(null);
	// const [gist, setGist] = useState({ "evidence": { "for": "", "against": "" }, "accused": " Sanjay Bachhulal Gupta, Salman Mohammed Jalil Ansari, Abbas Mustafa Lacche, Rakesh Suresh More ", "penalCode": "395, 397", "victim": "", "motive": false, "means": false, "oppurtunity": false, "guilty": false, "incomplete": true, "prosecution": "the state", "caseNumber": "14 / 2016", "id": "5e55e0f013de8602ff49de9a", "witness": {} });
	const [gist, setGist] = useState(null);
	const [loading, setLoading] = useState(false);

	const [msg, createMsg] = useNotification();

	const [result, setResult] = useState(null);

	if (props.medium !== "predict" && props.medium !== "train") {
		return <></>;
	}

	const handleFileSubmit = (e) => {
		e.preventDefault();
		if (file === null) return;

		setLoading(true);

		let formData = new FormData();
		formData.append("case", file);
		axios
			.post("/api/case", formData, {
				headers: {
					"content-type": "multipart/form-data",
				},
			})
			.then((res) => {
				res.data.accused = res.data.accused.join(",");
				res.data.penalCode = res.data.penalCode.join(",");
				res.data.victim = res.data.victim.join(",");
				res.data.prosecution = res.data.prosecution.join(",");
				console.log(res.data);
				// console.log(Object.keys(res.data["evidence"]["for"]).map(evidence => [evidence,res.data["evidence"]["for"][evidence]]))
				setTimeout(() => {
					setLoading(false);
					setGist(res.data);
					createMsg(
						5000,
						"Case details successfully extracted!",
						"success",
						true
					);
				}, 5000);
			})
			.catch((err) => {
				setLoading(false);
				console.log(err.response.data, err.response.data.message);
				createMsg(5000, err.response.data, "failure", true);
			});
	};

	const getGistByCaseNumber = (caseNumber) => {
		console.log(`/api/case`, caseNumber);
		setLoading(true);
		axios
			.get(`/api/case`, {
				params: { caseNumber },
			})
			.then((res) => {
				res.data.accused = res.data.accused.join(",");
				res.data.penalCode = res.data.penalCode.join(",");
				res.data.victim = res.data.victim.join(",");
				res.data.prosecution = res.data.prosecution.join(",");
				console.log(res.data);
				// console.log(Object.keys(res.data["evidence"]["for"]).map(evidence => [evidence,res.data["evidence"]["for"][evidence]]))
				setTimeout(() => {
					setGist(res.data);
					setLoading(false);
					createMsg(
						5000,
						"Case details successfully extracted!",
						"success",
						true
					);
				}, 5000);
			})
			.catch((err) => {
				setLoading(false);
				console.log(err.response.data, err.response.data.message);
				createMsg(5000, err.response.data, "failure", true);
			});
	};

	const updateGistPart = (newval, target1, target2, target3) => {
		const newGist = { ...gist };
		if (target1 === "evidence" && target2 && target3) {
			newGist[target1][target2][target3] = parseInt(newval);
		} else if (target1 === "evidence" && target2 && !target3) {
			newGist[target1][target2] = newval;
		} else {
			newGist[target1] = newval;
		}
		setGist(newGist);
	};

	const handleGistUpdateAndPredict = (e) => {
		e.preventDefault();
		setLoading(true);
		const data = { ...gist };
		data.accused = data.accused.split(",");
		data.penalCode = data.penalCode.split(",");
		data.penalCode = data.penalCode.map((pc) => parseInt(pc));
		data.victim = data.victim.split(",");
		data.prosecution = data.prosecution.split(",");
		console.log(data);
		axios
			.put(`/api/intelligence/${props.medium}/${data.id}`, data)
			.then((res) => {
				console.log(res.data);
				setTimeout(() => {
					setLoading(false);
					setResult(res.data);
				}, 5000);
			})
			.catch((err) => {
				setLoading(false);
				console.error(err.response.data);
				createMsg(5000, err.response.data, "failure", true);
			});
	};

	return (
		<Container>
			{loading ? (
				// <img src="https://tenor.com/view/scale-opposites-maybe-balance-gif-5526735" alt="Loading" />
				<center>
					<img
						src={law_loading}
						alt="Loading"
						style={{ marginTop: "30vh" }}
					/>
				</center>
			) : (
				<>
					{msg.message !== null ? <Notification {...msg} /> : <></>}
					{gist === null ? (
						<FileInput
							getGistByCaseNumber={getGistByCaseNumber}
							handleFileChange={setFile}
							handleFileSubmit={handleFileSubmit}
							err={msg.category === "failure" ? true : false}
						/>
					) : result === null ? (
						<GistUpdateForm
							{...props}
							handleGistUpdate={handleGistUpdateAndPredict}
							updateGistPart={updateGistPart}
							gist={{ ...gist }}
						/>
					) : (
						<Container>
							{props.medium === "train" ? (
								<>
									<h1 className="title underline">
										Result for training
									</h1>
									{Object.keys(result).map((res, index) => (
										<div
											key={index}
											style={{ margin: "1rem" }}
										>
											<h2 className="title">{res}</h2>
											<p className="text">
												{result[res]}
											</p>
										</div>
									))}
								</>
							) : (
								<div>
									<h1 className="title underline">
										Sugesstions:
									</h1>
									<br />
									<Grid columns="equal" stackable>
										<Grid.Row>
											<Grid.Column>
												<h2 className="title">
													Case Number:
												</h2>
											</Grid.Column>
											<Grid.Column>
												<h2 className="title">
													{gist["caseNumber"]}
												</h2>
											</Grid.Column>
											<Responsive
												minWidth={
													Responsive.onlyTablet
														.maxWidth + 1
												}
											>
												<Divider vertical />
											</Responsive>
											<Responsive
												minWidth={
													Responsive.onlyMobile
														.minWidth
												}
												maxWidth={
													Responsive.onlyTablet
														.maxWidth
												}
											>
												<Divider horizontal />
											</Responsive>
											<Grid.Column>
												<h2 className="title">
													Penal Codes:
												</h2>
											</Grid.Column>
											<Grid.Column>
												<h2 className="title">
													{gist["penalCode"]}
												</h2>
											</Grid.Column>
											<Divider horizontal />
										</Grid.Row>
										<Grid.Row>
											<Grid.Column>
												<h2 className="title">
													Suspects:
												</h2>
											</Grid.Column>
											<Grid.Column>
												<h2 className="title">
													{gist["accused"]}
												</h2>
											</Grid.Column>
											<Divider horizontal />
										</Grid.Row>
										<Grid.Row>
											<Grid.Column>
												<h2 className="title">
													Notion(suggestion):
												</h2>
											</Grid.Column>
											<Grid.Column>
												<h2 className="title">
													{result["suggestion"]}
												</h2>
											</Grid.Column>
											<br />
											{result["suggestion"] ===
											"guilty" ? (
												<>
													<Responsive
														minWidth={
															Responsive
																.onlyTablet
																.maxWidth + 1
														}
													>
														<Divider vertical />
													</Responsive>
													<Responsive
														minWidth={
															Responsive
																.onlyMobile
																.minWidth
														}
														maxWidth={
															Responsive
																.onlyTablet
																.maxWidth
														}
													>
														<Divider horizontal />
													</Responsive>
													<Grid.Column>
														<h2 className="title">
															Punishment(suggestion):
														</h2>
													</Grid.Column>
													<Grid.Column>
														<h2 className="title">
															{result[
																"punishment"
															].join(",")}
														</h2>
													</Grid.Column>
												</>
											) : (
												<></>
											)}
											<Divider />
										</Grid.Row>
										<Grid.Row textAlign="center">
											<button className="btn">
												<Link
													to="/"
													style={{ color: "inherit" }}
												>
													<span
														style={{
															color: "inherit",
														}}
													>
														Go Back Home{" "}
														<Icon name="angle double right" />
													</span>
												</Link>
											</button>
										</Grid.Row>
									</Grid>
								</div>
							)}
						</Container>
					)}
				</>
			)}
		</Container>
	);
};

export default Predict;
