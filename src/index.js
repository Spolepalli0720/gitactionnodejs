import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import App from './App/index';
// import * as serviceWorker from './serviceWorker';
import reducer from './store/reducer';
import config from './config';

import { registerFirebaseServiceWorker } from './firebase-messaging';

import 'jquery/dist/jquery.min.js'
import 'bootstrap/dist/js/bootstrap.min.js';
// import 'ace-builds/webpack-resolver.js';
import './index.scss';

const store = createStore(reducer);

const app = (
    <Provider store={store}>
        <BrowserRouter basename={config.basename}>
            <App />
        </BrowserRouter>
    </Provider>
);

ReactDOM.render(app, document.getElementById('root'));

//Register Firebase Service Worker
registerFirebaseServiceWorker();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
// serviceWorker.unregister();
