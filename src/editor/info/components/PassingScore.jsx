import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {scoped} from '@nti/lib-locale';
import {
	Checkbox,
	Input,
	Flyout,
	LabeledValue,
	// Loading
} from '@nti/web-commons';

const t = scoped('assignment-editor.editor.info.components.PassingScore', {
	description: 'What score is necessary for a learner to pass this assignment?',
	checkboxLabel: 'Passing Score',
	none: 'None'
});


export default class PassingScore extends React.Component {
	static propTypes = {
		assignment: PropTypes.object.isRequired
	}

	constructor (props) {
		super(props);
		this.setupValue(props);
	}


	setFlyoutRef = x => this.flyoutRef = x

	componentDidMount () {
		this.setupValue();
	}

	componentDidUpdate (oldProps) {
		if(oldProps.assignment !== this.props.assignment) {
			this.setupValue();
		}
	}

	setupValue (props = this.props) {
		//eslint-disable-next-line react/no-direct-mutation-state
		const setState = s => this.state ? this.setState(s) : (this.state = s);
		let value;// = 63; // hardcode for now, need to get from assignment

		setState({
			value,
			checked: Boolean(value)
		});
	}

	renderTrigger () {
		const {
			state: {value},
		} = this;

		const placeholder = value ? value + '%' : t('none');
		const labelClasses = cx({
			'placeholder': !value
		});

		return (
			<LabeledValue label={t('checkboxLabel')} className="passing-score-trigger" arrow>
				<span className={labelClasses}>{placeholder}</span>
			</LabeledValue>
		);
	}

	onSave = () => {
		// TODO: Save value to assignment
		this.closeMenu();
	}

	onCheckChange = (e) => {
		const checked = e.target.checked;
		const {checked:oldChecked} = this.state;

		if (checked !== oldChecked) {
			this.setState({
				checked
			});
		}
	}

	closeMenu () {
		if (this.flyoutRef) {
			this.flyoutRef.dismiss();
		}
	}

	getValue () {
		return this.state.value;
	}

	onPercentageChange = (value) => {
		this.setState({value});
	}

	renderContent () {
		const {value, checked} = this.state;

		// const errorMsg = error && error.message;

		// const saveClassNames = cx('available-save flyout-fullwidth-btn');

		return (
			<Flyout.Triggered
				ref={this.setFlyoutRef}
				className="passing-score-flyout"
				horizontalAlign={Flyout.ALIGNMENTS.LEFT}
				sizing={Flyout.SIZES.MATCH_SIDE}
				trigger={this.renderTrigger()}
				onDismiss={this.reset}
			>
				<Checkbox label={t('checkboxLabel')} checked={checked} onChange={this.onCheckChange} />
				<div className="description">{t('description')}</div>
				<Input.Percentage value={value} onChange={this.onPercentageChange} constrain disabled={!checked}/>
				{/*saving ? <Loading.Ellipsis/> : <div className={saveClassNames} onClick={this.onSave}>Save</div>*/}
			</Flyout.Triggered>
		);
	}

	render () {
		// const {assignment} = this.props;
		// const {value, saving, error} = this.state;
		return (
			<div className="field passing-score">
				{this.renderContent()}
			</div>
		);
	}
}
