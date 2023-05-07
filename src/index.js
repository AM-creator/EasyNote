import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import { Amplify } from 'aws-amplify';
import config from './aws-exports';
Amplify.configure(config);


ReactDOM.render(<App />, document.getElementById("root"));
