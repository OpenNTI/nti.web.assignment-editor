import React from 'react';
import cx from 'classnames';
import Selectable from '../../utils/Selectable';

export default class SingleChoice extends React.Component {
	static propTypes = {
		index: React.PropTypes.number,
		value: React.PropTypes.string,
		group: React.PropTypes.string,
		isCorrect: React.PropTypes.bool,
		onChange: React.PropTypes.func,
		onSolutionChanged: React.PropTypes.func,
		multipleAnswers: React.PropTypes.bool
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

		if (onSolutionChanged) {
			onSolutionChanged(index, e.target.checked);
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
		const {isCorrect, group, multipleAnswers} = this.props;
		const {index, value, selectableValue} = this.state;
		const id = group + ':' + index;
		const cls = cx('choice', {correct: isCorrect, 'multiple-answers': multipleAnswers});

		return (
			<Selectable className={cls} id={id} value={selectableValue} onUnselect={this.onBlur}>
				{this.renderSolution(group, isCorrect)}
				<input type="text" value={value} onChange={this.onChoiceChange} />
			</Selectable>
		);
	}


	renderSolution (group, isCorrect) {
		const {multipleAnswers} = this.props;

		if (multipleAnswers) {
			return (
				<input type="checkbox" checked={isCorrect} onChange={this.onSolutionChange} />
			);
		}

		return (
			<input type="radio" name={group} checked={isCorrect} onChange={this.onSolutionChange} />
		);
	}
}
