import React from 'react';
import Choices from './Choices';
import {savePartToQuestion} from './Actions';


export default class MultipleChoiceEditor extends React.Component {
	static propTypes = {
		part: React.PropTypes.object.isRequired,
		question: React.PropTypes.object.isRequired,
		multipleAnswers: React.PropTypes.bool
	}


	constructor (props) {
		super(props);

		const {part} = this.props;
		const {choices, solutions, NTIID:partId} = part;

		this.partType = (partId + '-answer').toLowerCase();

		this.state = {
			choices: this.mapChoices(choices, solutions, part.NTIID)
		};

		this.choicesChanged = this.choicesChanged.bind(this);
		this.addNewChoice = this.addNewChoice.bind(this);
		this.removeChoice = this.removeChoice.bind(this);
	}

	//TODO: listen for changes on the question to update the choices


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
				MimeType: this.partType,
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

		this.setState({
			choices: choices
		});
	}


	addNewChoice () {
		const {part} = this.props;
		const {NTIID:partId} = part;
		let {choices} = this.state;

		choices = choices.slice(0);

		choices.push({
			MimeType: this.partType,
			ID: partId + '-' + choices.length,
			label: '',
			correct: false,
			isNew: true
		});

		this.setState({
			choices: choices
		});
	}


	removeChoice (id) {
		let {choices} = this.state;

		choices = choices.filter((choice) => {
			let choiceId = choice.NTIID || choice.ID;

			return choiceId !== id
		});

		this.setState({
			choices: choices
		}, () => {
			this.choicesChanged(choices);
		});
	}


	render () {
		const {part, multipleAnswers} = this.props;
		const {choices} = this.state;

		return (
			<Choices
				partId={part.NTIID}
				partType={this.partType}
				choices={choices}
				onChange={this.choicesChanged}
				addNewChoice={this.addNewChoice}
				removeChoice={this.removeChoice}
				multipleAnswers={multipleAnswers}
			/>
		);
	}
}
