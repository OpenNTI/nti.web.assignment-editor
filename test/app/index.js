/*eslint no-console: 0*/
import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import Cmp from '../../src/index';

import 'normalize.css';

ReactDOM.render(
	<Cmp/>,
	document.getElementById('content')
);

