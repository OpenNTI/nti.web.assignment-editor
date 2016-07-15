/*eslint no-console: 0*/
import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import {ConflictResolutionHandler} from 'nti-web-commons';
import {decodeFromURI} from 'nti-lib-ntiids';
import {Editor} from '../../src';

import 'normalize.css';
import 'nti-style-common/all.scss';
import 'nti-web-commons/lib/index.css';
import 'nti-modeled-content/lib/index.css';

window.$AppConfig = window.$AppConfig || {server: '/dataserver2/'};

const Bridge = React.createClass({

	propTypes: {
		children: React.PropTypes.any
	},

	childContextTypes: {
		router: React.PropTypes.object
	},

	getChildContext () {
		return {
			router: {
				makeHref: (x) => x
			}
		};
	},

	render () {
		return React.Children.only(this.props.children);
	}

});

let assignmentId = localStorage.getItem('assignment-ntiid');

if (!assignmentId) {
	assignmentId = decodeFromURI(window.prompt('Enter Assignment NTIID'));
	localStorage.setItem('assignment-ntiid', assignmentId);
}


ReactDOM.render(
	<Bridge>
		<div>
			<ConflictResolutionHandler />
			<Editor NTIID={assignmentId} />
		</div>
	</Bridge>,
	document.getElementById('content')
);
