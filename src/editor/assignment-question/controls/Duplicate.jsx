import React from 'react';
import autobind from 'nti-commons/lib/autobind';

import {duplicateQuestionFrom} from '../Actions';

const TITLE = 'Duplicate';

export default class DeleteControl extends React.Component {
	static propTypes = {
		question: React.PropTypes.object.isRequired,
		questionSet: React.PropTypes.object.isRequired
	}



	constructor (props) {
		super(props);

		autobind(this, 'onClick');
	}


	onClick () {
		const {question, questionSet} = this.props;

		duplicateQuestionFrom(question, questionSet);
	}


	render () {
		return (
			<i className="icon-duplicate" title={TITLE} onClick={this.onClick}/>
		);
	}
}
