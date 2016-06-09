import React from 'react';
import cx from 'classnames';
import Selectable from '../../utils/Selectable';

export default class Choice extends React.Component {
	static propTypes = {
		choice: React.PropTypes.object,
		error: React.PropTypes.any,
		group: React.PropTypes.string,
		onChange: React.PropTypes.func,
		onRemove: React.PropTypes.func,
		onSolutionChange: React.PropTypes.func,
		multipleAnswers: React.PropTypes.bool
	}


	constructor (props) {
		super(props);

		const {choice, error} = this.props;

		this.isNew = choice.isNew;

		this.state = {
			label: choice.label,
			correct: choice.correct,
			selectableId: choice.NTIID || choice.ID,
			selectableValue: choice.label,
			error
		};

		this.setLabelRef = x => this.labelInput = x;

		this.onBlur = this.onBlur.bind(this);
		this.onLabelChange = this.onLabelChange.bind(this);
		this.onSolutionChange = this.onSolutionChange.bind(this);
		this.onRemove = this.onRemove.bind(this);
	}


	componentWillReceiveProps (nextProps) {
		const {choice:newChoice, error:newError} = nextProps;
		const {choice:oldChoice, error:oldError} = this.props;
		let state = null;

		if (newChoice !== oldChoice) {
			state = state || {};
			state.label = newChoice.label;
			state.correct = newChoice.correct;
		}

		if (newError !== oldError) {
			state = state || {};
			state.error = newError;
		}

		if (state) {
			this.setState(state);
		}
	}


	componentDidMount () {
		const {isNew} = this;

		if (isNew && this.labelInput) {
			this.labelInput.focus();
			delete this.isNew;
		}
	}


	onChange () {
		const {choice, onChange} = this.props;
		const {label, correct} = this.state;

		if (onChange && (choice.label !== label || choice.correct !== correct)) {
			onChange(choice.NTIID || choice.ID, label, correct);
		}
	}


	onBlur () {
		this.onChange();
	}


	onLabelChange (e) {
		const {error} = this.state;

		this.setState({
			label: e.target.value
		}, () => {
			if (error && error.clear) {
				this.onChange();
				error.clear();
			}
		});
	}


	onSolutionChange (e) {
		const {onSolutionChange, choice} = this.props;

		if (onSolutionChange) {
			onSolutionChange(choice.NTIID || choice.ID, e.target.checked);
		}
	}


	onRemove () {
		const {onRemove, choice} = this.props;

		if (onRemove) {
			onRemove(choice.NTIID || choice.ID);
		}
	}


	render () {
		const {group, multipleAnswers} = this.props;
		const {label, correct, error, selectableValue, selectableId} = this.state;
		const cls = cx('choice', {correct: correct, 'multiple-answers': multipleAnswers, error});

		return (
			<Selectable className={cls} id={selectableId} value={selectableValue} onUnselect={this.onBlur}>
				{this.renderSolution(group, correct, multipleAnswers)}
				<input ref={this.setLabelRef} type="text" value={label} onChange={this.onLabelChange} />
				<div className="remove" onClick={this.onRemove}>X</div>
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
