import React from 'react';
import cx from 'classnames';
import Choice from './Choice';
import Add from './AddButton';
import {Ordering} from '../../../dnd';

const CHOICE_TYPE = 'application/vnd.nextthought.app.multiplecchoiceanswer';

//If the index isn't already in the solutions add it
function setSolutionCorrect (index, solutions) {
	for (let solution of solutions) {
		if (solution === index) {
			return;
		}
	}

	solutions.push(index);

	return solutions;
}


function removeSolution (index, solutions) {
	return solutions.reduce((acc, solution) => {
		if (solution !== index) {
			acc.push(solution);
		}

		return acc;
	}, []);
}


export default class SingleChoices extends React.Component {
	static propTypes = {
		choices: React.PropTypes.array.isRequired,
		solution: React.PropTypes.array,
		partId: React.PropTypes.string,
		onChange: React.PropTypes.func,
		multipleAnswers: React.PropTypes.bool
	}

	constructor (props) {
		super(props);

		let {choices, solution} = props;

		choices = choices.slice(0);

		choices = this.mapChoices(choices);

		//TODO: track the correctness on the choice, so if they are re-ordered the solution follows it

		this.state = {
			choices: choices,
			solution: solution
		};

		this.onChoiceChanged = this.onChoiceChanged.bind(this);
		this.onSolutionChanged = this.onSolutionChanged.bind(this);
		this.renderChoice = this.renderChoice.bind(this);
		this.onAdd = this.onAdd.bind(this);
		this.onOrderChange = this.onOrderChange.bind(this);
	}


	componentWillReceiveProps (nextProps) {
		let {choices, solution} = nextProps;

		choices = choices.slice(0);

		choices = this.mapChoices(choices);

		this.setState({
			choices: choices,
			solution: solution
		});
	}


	mapChoices (choices) {
		const {partId} = this.props;

		return choices.map((choice, index) => {
			return {
				MimeType: CHOICE_TYPE,
				label: choice,
				ID: partId + '-' + index
			};
		});
	}


	isChoiceCorrect (choice, index) {
		const {solution} = this.state;

		for (let s of solution) {
			if (s === index) {
				return true;
			}
		}

		return false;
	}


	onChange () {
		const {onChange} = this.props;
		let {choices, solution} = this.state;

		choices = choices.map(choice => choice.label);

		if (onChange) {
			onChange(choices, solution);
		}
	}


	onOrderChange (newOrder) {
		this.setState({
			choices: newOrder
		}, () => {
			this.onChange();
		});
	}


	onChoiceChanged (index, value) {
		let {choices} = this.state;

		choices = choices.slice(0);

		choices[index].label = value;

		this.setState({
			choices: choices
		}, () => {
			this.onChange();
		});
	}


	onSolutionChanged (index, correct) {
		const {multipleAnswers} = this.props;
		let {solution} = this.state;

		if (!multipleAnswers) {
			solution = correct ? [index] : solution;
		} else if (correct) {
			solution = setSolutionCorrect(index, solution);
		} else {
			solution = removeSolution(index, solution);
		}

		this.setState({
			solution: solution
		});
	}


	onAdd () {
		const {choices} = this.state;

		choices.push('');

		this.setState({
			choices: choices
		});
	}


	render () {
		const {multipleAnswers, partId} = this.props;
		const {choices} = this.state;
		const cls = cx('multiple-choice', {'multiple-answer': multipleAnswers});

		return (
			<div className={cls}>
				<Ordering containerId={partId} items={choices} renderItem={this.renderChoice} accepts={[CHOICE_TYPE]} onChange={this.onOrderChange}/>
				{this.renderAddButton()}
			</div>
		);
	}


	renderChoice (choice, index) {
		const {partId, multipleAnswers} = this.props;
		const group = partId + '--solution-group';
		const selected = this.isChoiceCorrect(choice, index);

		return (
			<Choice
				index={index}
				value={choice.label}
				isCorrect={selected}
				group={group}
				onChange={this.onChoiceChanged}
				onSolutionChanged={this.onSolutionChanged}
				multipleAnswers={multipleAnswers}
			/>
		);
	}


	renderAddButton () {
		const {multipleAnswers} = this.props;

		return (
			<li>
				<Add multipleAnswers={multipleAnswers} onAdd={this.onAdd} />
			</li>
		);
	}
}
