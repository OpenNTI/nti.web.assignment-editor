/*eslint no-console: 0*/
import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import {ConflictResolutionHandler} from 'nti-web-commons';
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


ReactDOM.render(
	<Bridge>
		<div>
			<ConflictResolutionHandler />
			<Editor />
		</div>
	</Bridge>,
	document.getElementById('content')
);
