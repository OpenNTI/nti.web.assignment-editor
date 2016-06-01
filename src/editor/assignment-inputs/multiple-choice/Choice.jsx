import React from 'react';
import cx from 'classnames';
import Selectable from '../../utils/Selectable';

export default class Choice extends React.Component {
	static propTypes = {
		choice: React.PropTypes.object,
		group: React.PropTypes.string,
		onChange: React.PropTypes.func,
		onSolutionChange: React.PropTypes.func,
		multipleAnswers: React.PropTypes.bool
	}


	constructor (props) {
		super(props);

		const {choice} = this.props;

		this.state = {
			label: choice.label,
			correct: choice.correct
		};

		this.onBlur = this.onBlur.bind(this);
		this.onLabelChange = this.onLabelChange.bind(this);
		this.onSolutionChange = this.onSolutionChange.bind(this);
	}


	componentWillReceiveProps (nextProps) {
		const {choice} = nextProps;

		this.setState({
			label: choice.label,
			correct: choice.correct
		});
	}


	onBlur () {
		const {choice, onChange} = this.props;
		const {label, correct} = this.state;

		if (onChange) {
			onChange(choice.NTIID || choice.ID, label, correct);
		}
	}


	onLabelChange (e) {
		this.setState({
			label: e.target.value
		});
	}


	onSolutionChange (e) {
		const {onSolutionChange, choice} = this.props;

		if (onSolutionChange) {
			onSolutionChange(choice.NTIID || choice.ID, e.target.checked);
		}
	}


	render () {
		const {group, multipleAnswers, choice} = this.props;
		const {label, correct} = this.state;
		const id = choice.NTIID || choice.ID;
		const cls = cx('choice', {correct: correct, 'multiple-answers': multipleAnswers});

		return (
			<Selectable className={cls} id={id} value={label} onUnselect={this.onBlur}>
				{this.renderSolution(group, correct, multipleAnswers)}
				<input type="text" value={label} onChange={this.onLabelChange} />
			</Selectable>
		);
	}


	renderSolution (group, correct, multipleAnswers) {
		if (multipleAnswers) {
			return (
				<input type="checkbox" checked={correct} onChange={this.onSolutionChange} />
			);
		}

		return (
			<input type="radio" name={group} checked={correct} onChange={this.onSolutionChange} />
		);
	}
}
