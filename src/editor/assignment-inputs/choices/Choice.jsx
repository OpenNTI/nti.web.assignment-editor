import React from 'react';
import cx from 'classnames';
import Selectable from '../../utils/Selectable';

/**
 * Render a choice for a assignment question.
 *
 * the choice object should look like:
 * {
 * 		MimeType: String,
 * 		label: String,
 * 		NTIID | ID: String,
 * 		error: Object//the active error for the choice
 * }
 */
export default class Choice extends React.Component {
	static propTypes = {
		choice: React.PropTypes.object,
		className: React.PropTypes.string,
		onChange: React.PropTypes,
		plainText: React.PropTypes.bool
	}


	constructor (props) {
		super(props);

		const {choice} = this.props;

		this.isNew = choice.isNew;

		this.state = {
			label: choice.label,
			selectableId: choice.NTIID || choice.ID,
			selectableValue: choice.label,
			error: choice.error
		};

		this.setInputRef = x => this.inputRef = x;

		this.onUnselect = this.onUnselect.bind(this);
		this.onSelect = this.onSelect.bind(this);

		this.onInputFocus = this.onInputFocus.bind(this);
		this.onInputBlur = this.onInputBlur.bind(this);
		this.onInputChange = this.onInputChange.bind(this);
	}


	componentWillReceiveProps (nextProps) {
		const {choice: newChoice} = nextProps;
		const {choice: oldChoice} = this.props;
		let state = null;

		if (newChoice !== oldChoice) {
			state = state || {};

			state.label = newChoice.label;
			state.selectableId = newChoice.NTIID || newChoice.ID;
			state.selectableValue = newChoice.label;
			state.error = newChoice.error;
		}

		if (state) {
			this.setState(state);
		}
	}


	componentDidMount () {
		if (this.isNew && this.inputRef) {
			this.inputRef.focus();
			delete this.isNew;
		}
	}


	onChange () {
		const {onChange, choice} = this.props;
		const {label} = this.state;

		if (onChange && choice.label !== label) {
			onChange({...choice, label: label});
		}
	}


	onInputChange (e) {
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


	onInputFocus () {
		const {label} = this.state;

		this.setState({
			selectableValue: label + ' FOCUSED'
		});
	}


	onInputBlur () {
		const {label} = this.state;

		this.setState({
			selectableValue: label
		});
	}


	onSelect () {
		if (this.inputRef) {
			this.inputRef.focus();
		}
	}


	onUnselect () {
		this.onChange();
	}


	render () {
		const {className, choice} = this.props;
		const {label, error, selectableId, selectableValue} = this.state;
		const cls = cx(className, 'assignment-input-choice', {error, correct: choice.correct});

		return (
			<Selectable className={cls} id={selectableId} value={selectableValue} onSelect={this.onSelect} onUnselect={this.onUnselect}>
				<input type="text" ref={this.setInputRef} value={label} onFocus={this.onInputFocus} onBlur={this.onInputBlur} onChange={this.onInputChange}/>
			</Selectable>
		);
	}
}
