import "react-app-polyfill/ie11";
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import AppWrapper from "./AppWrapper";
import { ToastContainer } from "react-toastify";
//import * as serviceWorker from './serviceWorker';

ReactDOM.render(
    <BrowserRouter>
        <ToastContainer />
        <AppWrapper></AppWrapper>
    </BrowserRouter>,
    document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
