import React from 'react';
import Question from './Question';

export default class QuestionSetComponent extends React.Component {

	static propTypes = {
		QuestionSet: React.PropTypes.object.isRequired
	}

	constructor (props) {
		super(props);

		this.state = {};
	}


	render () {
		const {QuestionSet} = this.props;
		const {questions} = QuestionSet;

		return (
			<div className="questions">
				{questions.map((question) => {
					return (<Question key={question.NTIID} Question={question} />);
				})}
			</div>
		);
	}
}
