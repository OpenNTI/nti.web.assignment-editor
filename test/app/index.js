/*eslint no-console: 0*/
// import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import {ConflictResolutionHandler} from '@nti/web-commons';
import {decodeFromURI} from '@nti/lib-ntiids';

import {Editor} from '../../src';


window.$AppConfig = window.$AppConfig || {server: '/dataserver2/'};

class Bridge extends React.Component {

	static propTypes = {
		children: PropTypes.any
	}

	static childContextTypes = {
		router: PropTypes.object
	}

	getChildContext () {
		return {
			router: {
				makeHref: (x) => x
			}
		};
	}

	render () {
		return React.Children.only(this.props.children);
	}
}

let assignmentId = localStorage.getItem('assignment-ntiid');

if (!assignmentId) {
	assignmentId = decodeFromURI(window.prompt('Enter Assignment NTIID'));
	localStorage.setItem('assignment-ntiid', assignmentId);
}

let courseId = localStorage.getItem('course-ntiid');

if (!courseId) {
	courseId = decodeFromURI(window.prompt('Enter Course NTIID'));
	localStorage.setItem('course-ntiid', courseId);
}

const noop = () => {};

ReactDOM.render(
	<Bridge>
		<div>
			<ConflictResolutionHandler />
			<Editor assignmentId={assignmentId} courseId={courseId} gotoRoot={noop}/>
		</div>
	</Bridge>,
	document.getElementById('content')
);
