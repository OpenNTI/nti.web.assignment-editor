import React from 'react';
import Choices from './Choices';
import {savePartToQuestion} from './Actions';

const CHOICE_TYPE = 'application/vnd.nextthought.app.multiplecchoiceanswer';

export default class MultipleChoiceEditor extends React.Component {
	static propTypes = {
		part: React.PropTypes.object.isRequired,
		question: React.PropTypes.object.isRequired,
		multipleAnswers: React.PropTypes.bool
	}


	constructor (props) {
		super(props);

		const {part} = this.props;
		const {choices, solutions} = part;

		this.state = {
			choices: this.mapChoices(choices, solutions, part.NTIID)
		};

		this.choicesChanged = this.choicesChanged.bind(this);
	}


	componentWillReceiveProps (nextProps) {
		const {part} = nextProps;
		const {choices, solutions} = part;

		this.setState({
			choices: this.mapChoices(choices, solutions, part.NTIID)
		});
	}


	mapChoices (choices, solutions, partId) {
		let solution = solutions[0];//For now just handle the first solution

		solution = solution && solution.value;

		if (!Array.isArray(solution)) {
			solution = [solution];
		}

		solution = solution.reduce((acc, s) => {
			acc[s] = true;

			return acc;
		}, {});

		return choices.map((choice, index) => {
			return {
				MimeType: CHOICE_TYPE,
				ID: partId + '-' + index,
				label: choice,
				correct: solution[index]
			};
		});
	}


	choicesChanged (choices) {
		const {part, question, multipleAnswers} = this.props;

		let values = choices.reduce((acc, choice, index) => {
			acc.choices.push(choice.label);

			if (choice.correct) {
				acc.solutions.push(index);
			}

			return acc;
		}, {choices: [], solutions: []});

		if (!multipleAnswers) {
			values.solutions = values.solutions[0];
		}

		savePartToQuestion(question, part, '', values.choices, values.solutions);
	}


	render () {
		const {part, multipleAnswers} = this.props;
		const {choices} = this.state;

		return (
			<Choices
				partId={part.NTIID}
				choices={choices}
				onChange={this.choicesChanged}
				multipleAnswers={multipleAnswers}
			/>
		);
	}
}
