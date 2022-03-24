import React from 'react';
import { render } from 'react-dom';
import { HashRouter, BrowserRouter } from 'react-router-dom';

import * as serviceWorker from './serviceWorker';
import App from './app';

const rootElement = document.getElementById('root');

render(
    <BrowserRouter>
        <App />
    </BrowserRouter>,
    rootElement
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

