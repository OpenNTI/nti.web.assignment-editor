import React from 'react';
import cx from 'classnames';
import Choice from './Choice';


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

		const {choices, solution} = props;

		this.state = {
			choices: choices,
			solution: solution
		};

		this.onChoiceChanged = this.onChoiceChanged.bind(this);
		this.onSolutionChanged = this.onSolutionChanged.bind(this);
		this.renderChoice = this.renderChoice.bind(this);
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


	onChoiceChanged (index, value) {
		const {onChange} = this.props;
		let {choices, solution} = this.state;

		choices[index] = value;

		if (onChange) {
			onChange(choices, solution);
		}
	}


	onSolutionChanged (index, correct) {
		debugger;
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


	render () {
		const {multipleAnswers} = this.props;
		const {choices} = this.state;
		const cls = cx('multiple-choice', {'multiple-answer': multipleAnswers});

		return (
			<ul className={cls}>
				{choices.map(this.renderChoice)}
			</ul>
		);
	}


	renderChoice (choice, index) {
		const {partId, multipleAnswers} = this.props;
		const group = partId + '--solution-group';
		const selected = this.isChoiceCorrect(choice, index);

		return (
			<li key={index}>
				<Choice
					index={index}
					value={choice}
					isCorrect={selected}
					group={group}
					onChange={this.onChoiceChanged}
					onSolutionChanged={this.onSolutionChanged}
					multipleAnswers={multipleAnswers}
				/>
			</li>
		);
	}
}
