import React from 'react';
import Predict from "./components/Predict";
import LandingPage from "./components/Landing";
import { Switch, Route } from "react-router-dom";

import law_loading from "./law_loading.gif"

function App() {

	return (
		<Switch>
			<Route exact path="/" render={() => <LandingPage />} />
			<Route exact path="/predict" render={() => <Predict medium="predict" />} />
			<Route exact path="/train" render={() => <Predict medium="train" />} />
			<Route exact path="/gif" render={() => (
				<center>
					<img src={law_loading} alt="Loading" style={{marginTop: "30vh"}} />
				</center>
			)} />
		</Switch>
	)

}

export default App;