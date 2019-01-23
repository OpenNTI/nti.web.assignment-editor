import React from 'react';

import {Icon, Title, Background, Meta, Grade} from './submission-states';

export default class SubmissionStatus extends React.Component {
	render () {
		return (
			<Background {...this.props} className="assignment-navigation-bar-status-submission">
				<Icon {...this.props} />
				<Title {...this.props} />
				<Meta {...this.props} />
				<Grade {...this.props} />
			</Background>
		);
	}
}
