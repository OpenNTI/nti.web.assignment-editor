import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {scoped} from '@nti/lib-locale';
import {
	HOC,
	Checkbox,
	Input,
	Flyout,
	LabeledValue,
	Loading
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

		const {assignment} = props;
		let value = assignment && Math.floor(assignment.passingScore * 100.0);

		setState({
			value,
			storedValue: value,
			checked: Boolean(value),
			disabled: !assignment || !assignment.totalPoints
		});
	}

	onSave = async () => {
		const {assignment} = this.props;
		const {checked} = this.state;

		this.setState({saving: true});

		try {
			if(assignment) {
				const value = this.getValue();

				await assignment.save({
					'completion_passing_percent': checked && value ? value / 100.0 : null
				});

				this.setState({storedValue: value});
				this.closeMenu();
			}
		}
		catch (e) {
			this.setState({error: e.message || e});
		}
		finally {
			this.setState({saving: false});
		}
	}

	onCheckChange = (e) => {
		const checked = e.target.checked;
		const {checked:oldChecked} = this.state;

		if (checked !== oldChecked) {
			this.setState({
				checked,
				value: checked ? this.getValue() : null
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

	onAssignmentChanged = () => {
		this.setupValue();
	}

	renderTrigger () {
		const {
			state: {storedValue: value, disabled}
		} = this;

		const placeholder = value ? value + '%' : t('none');
		const labelClasses = cx({
			'placeholder': !value
		});

		return (
			<LabeledValue label={t('checkboxLabel')} className="passing-score-trigger" arrow disabled={disabled}>
				<span className={labelClasses}>{placeholder}</span>
			</LabeledValue>
		);
	}

	renderContent () {
		const {assignment} = this.props;
		const {value, checked, saving, error} = this.state;
		const saveClassNames = cx('save-button flyout-fullwidth-btn');

		return (
			<HOC.ItemChanges item={assignment} onItemChanged={this.onAssignmentChanged}>
				<Flyout.Triggered
					ref={this.setFlyoutRef}
					className="passing-score-flyout"
					horizontalAlign={Flyout.ALIGNMENTS.LEFT}
					sizing={Flyout.SIZES.MATCH_SIDE}
					trigger={this.renderTrigger()}
					onDismiss={this.reset}
				>
					{error && <div className="error">{error}</div>}
					<Checkbox label={t('checkboxLabel')} checked={checked} onChange={this.onCheckChange} />
					<div className="description">{t('description')}</div>
					<Input.Percentage value={value} onChange={this.onPercentageChange} constrain disabled={!checked}/>
					{saving ? <Loading.Ellipsis/> : <div className={saveClassNames} onClick={this.onSave}>Save</div>}
				</Flyout.Triggered>
			</HOC.ItemChanges>
		);
	}

	render () {
		return (
			<div className="field passing-score">
				{this.renderContent()}
			</div>
		);
	}
}
