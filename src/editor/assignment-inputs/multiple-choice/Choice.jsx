import React from 'react';
import cx from 'classnames';
import Selectable from '../../utils/Selectable';

export default class Choice extends React.Component {
	static propTypes = {
		choice: React.PropTypes.object,
		group: React.PropTypes.string,
		onChange: React.PropTypes.func,
		onRemove: React.PropTypes.func,
		onSolutionChange: React.PropTypes.func,
		multipleAnswers: React.PropTypes.bool
	}


	constructor (props) {
		super(props);

		const {choice} = this.props;

		this.isNew = choice.isNew;

		this.state = {
			label: choice.label,
			correct: choice.correct
		};

		this.setLabelRef = x => this.labelInput = x;

		this.onBlur = this.onBlur.bind(this);
		this.onLabelChange = this.onLabelChange.bind(this);
		this.onSolutionChange = this.onSolutionChange.bind(this);
		this.onRemove = this.onRemove.bind(this);
	}


	componentWillReceiveProps (nextProps) {
		const {choice} = nextProps;

		this.setState({
			label: choice.label,
			correct: choice.correct
		});
	}


	componentDidMount () {
		const {isNew} = this;

		if (isNew && this.labelInput) {
			this.labelInput.focus();
			delete this.isNew;
		}
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


	onRemove () {
		const {onRemove, choice} = this.props;

		if (onRemove) {
			onRemove(choice.NTIID || choice.ID);
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
