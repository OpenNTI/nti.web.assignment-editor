/*eslint no-console: 0*/
// import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
// import PropTypes from 'prop-types';
// import {ConflictResolutionHandler} from '@nti/web-commons';
// import {decodeFromURI} from '@nti/lib-ntiids';

import Test from './navigation-bar-status';
// import Test from './editor';

window.$AppConfig = window.$AppConfig || {server: '/dataserver2/'};


ReactDOM.render(
	<Test />,
	document.getElementById('content')
);
