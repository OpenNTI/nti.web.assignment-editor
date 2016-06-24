import React from 'react';
import autobind from 'nti-commons/lib/autobind';

import {deleteQuestionFrom} from '../Actions';

const TITLE = 'Delete';

export default class DeleteControl extends React.Component {
	static propTypes = {
		question: React.PropTypes.object.isRequired,
		questionSet: React.PropTypes.object.isRequired,
		assignment: React.PropTypes.object.isRequired
	}



	constructor (props) {
		super(props);

		autobind(this, 'onClick');
	}


	onClick () {
		const {question, questionSet, assignment} = this.props;

		deleteQuestionFrom(question, questionSet, assignment);
	}


	render () {
		return (
			<i className="icon-delete" title={TITLE} onClick={this.onClick}/>
		);
	}
}
