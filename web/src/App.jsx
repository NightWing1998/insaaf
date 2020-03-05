import React from 'react';
import Train from "./components/Train";
import Predict from "./components/Predict";
import LandingPage from "./components/Landing";
import { Switch, Route } from "react-router-dom"

function App() {

	return (
		<Switch>
			<Route exact path="/" render={() => <LandingPage />} />
			<Route exact path="/train" render={() => <Train />} />
			<Route exact path="/predict" render={() => <Predict />} />
		</Switch>
	)

}

export default App;