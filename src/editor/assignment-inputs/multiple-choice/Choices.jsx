import React from 'react';
import Selectable from '../../utils/Selectable';

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

		this.renderChoice = this.renderChoice.bind(this);
		this.renderSolution = this.renderSolution.bind(this);
		this.onChoiceChanged = this.onChoiceChanged.bind(this);
		this.onSolutionChanged = this.onSolutionChanged.bind(this);
		this.onChoiceBlur = this.onChoiceBlur.bind(this);
	}


	onChoiceChanged (e) {
		let {choices} = this.state;
		const index = e.target.getAttribute('data-index');
		const value = e.target.value;

		choices[index] = value;

		this.setState({
			choices: choices
		});
	}


	onSolutionChanged (e) {
		let value = e.target.value;

		value = parseInt(value, 10);

		this.setState({
			solution: value
		});
	}


	onChoiceBlur () {
		const {onChange} = this.props;
		const {choices, solution} = this.state;

		if (onChange) {
			onChange(choices, solution);
		}
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
		const {partId} = this.props;
		const id = partId + '--' + index;

		return (
			<li key={index}>
				<Selectable className="choice" id={id} value={choice} onUnselect={this.onChoiceBlur}>
					{this.renderSolution(choice, index)}
					<input type="text" data-index={index} value={choice} onChange={this.onChoiceChanged} />
				</Selectable>
			</li>
		);
	}


	renderSolution (choice, index) {
		const {solution} = this.state;
		const {partId} = this.props;
		const radioGroup = partId + '-solution-group';
		const selected = solution === index;

		return (
			<input type="radio" value={index} name={radioGroup} selected={selected} onChange={this.onSolutionChanged} checked={selected} />
		);
	}
}
