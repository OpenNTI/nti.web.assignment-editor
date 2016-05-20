import React from 'react';
import Choice from './Choice';

export default class Choices extends React.Component {
	static propTypes = {
		choices: React.PropTypes.array.isRequired,
		solution: React.PropTypes.number,
		partId: React.PropTypes.string,
		onChange: React.PropTypes.func
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


	onChoiceChanged (index, value) {
		const {onChange} = this.props;
		let {choices, solution} = this.state;

		choices[index] = value;

		if (onChange) {
			onChange(choices, solution);
		}
	}


	onSolutionChanged (correct) {
		this.setState({
			solution: correct
		});
	}


	render () {
		const {choices} = this.state;

		return (
			<ul className="multiple-choice">
				{choices.map(this.renderChoice)}
			</ul>
		);
	}


	renderChoice (choice, index) {
		const {solution} = this.state;
		const {partId} = this.props;
		const group = partId + '--solution-group';
		const selected = solution === index;

		return (
			<li key={index}>
				<Choice
					index={index}
					value={choice}
					isCorrect={selected}
					group={group}
					onChange={this.onChoiceChanged}
					onSolutionChanged={this.onSolutionChanged}
				/>
			</li>
		);
	}
}
