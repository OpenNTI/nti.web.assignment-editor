/*eslint no-console: 0*/
import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import {ConflictResolutionHandler} from 'nti-web-commons';
import {Editor} from '../../src/index';
import Dnd from '../../src/dnd/';
import Ordering from '../../src/dnd/ordering';

import 'normalize.css';
import 'nti-style-common/all.scss';
import 'nti-web-commons/lib/index.css';
import 'nti-modeled-content/lib/index.css';

window.$AppConfig = window.$AppConfig || {server: '/dataserver2/'};

ReactDOM.render(
	<div>
		<ConflictResolutionHandler />
		<Editor />
	</div>,
	document.getElementById('content')
);
