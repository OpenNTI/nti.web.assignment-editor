import React from 'react';
import Selectable from '../../utils/Selectable';

export default class Choice extends React.Component {
	static propTypes = {
		index: React.PropTypes.number,
		value: React.PropTypes.string,
		group: React.PropTypes.string,
		isCorrect: React.PropTypes.bool,
		onChange: React.PropTypes.func,
		onSolutionChanged: React.PropTypes.func
	}


	constructor (props) {
		super(props);

		const {index, value} = this.props;

		this.state = {
			value: value,
			index: index,
			selectableValue: value
		};

		this.onBlur = this.onBlur.bind(this);
		this.onChoiceChange = this.onChoiceChange.bind(this);
		this.onSolutionChange = this.onSolutionChange.bind(this);
	}


	componentWillReceiveProps (nextProps) {
		const {value} = nextProps;

		this.setState({
			value: value
		});
	}


	onChoiceChange (e) {
		this.setState({
			value: e.target.value
		});
	}


	onSolutionChange (e) {
		const {onSolutionChanged} = this.props;
		const {index} = this.state;

		if (e.target.checked) {
			onSolutionChanged(index);
		}
	}


	onBlur () {
		const {onChange} = this.props;
		const {index, value} = this.state;

		if (onChange) {
			onChange(index, value);
		}
	}


	render () {
		const {isCorrect, group} = this.props;
		const {index, value, selectableValue} = this.state;
		const id = group + ':' + index;

		return (
			<Selectable className="choice" id={id} value={selectableValue} onUnselect={this.onBlur}>
				{this.renderSolution(group, isCorrect)}
				<input type="text" value={value} onChange={this.onChoiceChange} />
			</Selectable>
		);
	}


	renderSolution (group, isCorrect) {
		return (
			<input type="radio" name={group} checked={isCorrect} onChange={this.onSolutionChange} />
		);
	}
}
