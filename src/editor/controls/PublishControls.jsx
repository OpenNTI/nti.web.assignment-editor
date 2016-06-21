import React from 'react';
import {Publish} from 'nti-web-commons';

export default class PublishControls extends React.Component {

	render () {
		return (
			<div className="publish-controls">
				<Publish alignment="top-right" enableDelete={true} />
			</div>
		);
	}
}
