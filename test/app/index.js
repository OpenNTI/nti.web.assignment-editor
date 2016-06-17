/*eslint no-console: 0*/
import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import {Editor} from '../../src/index';
import Dnd from '../../src/dnd/';
import Ordering from '../../src/dnd/ordering';

import 'normalize.css';
import 'nti-style-common/fonts.scss';
import 'nti-web-commons/lib/index.css';
import 'nti-modeled-content/lib/index.css';

ReactDOM.render(
	<Editor />,
	document.getElementById('content')
);
