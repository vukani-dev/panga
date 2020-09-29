import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Home from './components/Home'
import Panga from './containers/Panga'
import * as serviceWorker from './serviceWorker';
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import { Provider } from "react-redux";
import store from "./redux/store";

ReactDOM.render(
    <Provider store={store}>
        <Panga />
    </Provider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();