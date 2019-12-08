import React from "react";
import ReactDOM from "react-dom";

import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
// import API from './API';

import "./index.css";
import App from "./App";
import Login from './components/Login';

import * as serviceWorker from "./serviceWorker";

// async function isAuthenticated(){
// 	return await API.get("/account")
// 		.then(res => true)
// 		.catch(err => false);	
// }

const routing = (
	<Router>
		<div>
			<Switch>
				<Route exact path='/' component={Login} />
				<Route path='/dashboard' component={App} />
				{/* <PrivateRoute 
					path='/dashboard' 
					component={App} 
					isAuthenticated={!!isAuthenticated()}
				/> */}
			</Switch>
		</div>
	</Router>
)

ReactDOM.render(routing, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
