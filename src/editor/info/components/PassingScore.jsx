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
	Loading,
	Prompt
} from '@nti/web-commons';

const {SaveCancel} = Prompt;

const t = scoped('assignment-editor.editor.info.components.PassingScore', {
	description: 'What score is necessary for a learner to pass this assignment?',
	checkboxLabel: 'Passing Score',
	none: 'None',
	promptDescription: 'In order to have a passing score, the assignment must also have a total points value'
});

const promptScope = scoped('assignment-editor.editor.info.components.PassingScore.PromptScope', {
	title: 'Input Total Points',
	save: 'Save',
	cancel: 'Cancel'
});

export const rel = 'completion-passing-percent';

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
			disabled: !assignment.hasLink(rel)
		});
	}

	onSave = async (e, forceTotalPointSave) => {
		if(!this.hasChanges()) {
			return;
		}

		const {assignment} = this.props;
		const {checked, totalPoints} = this.state;

		this.setState({saving: true});

		try {
			if(assignment) {
				const value = this.getValue();

				if(forceTotalPointSave) {
					// the user entered a totalPoints value in the prompt, so now we will save both that and passingScore
					await assignment.save({
						'completion_passing_percent': checked && value ? value / 100.0 : null,
						'total_points': totalPoints
					}, void 0, rel);

					this.setState({showPrompt: false});
					this.closeMenu();
				}
				else if(!assignment.passingScore && value && !assignment.totalPoints) {
					// in this case, we are setting a passingScore value on the assignment, but
					// the assignment doesn't have a totalPoints value, in which case we need to prompt
					// the user to ask them to input a total points value (passingScore with no totalPoints doesn't
					// make much sense)
					this.setState({showPrompt: true, totalPoints: 100});
				}
				else {
					// otherwise, we are free to just save the changes to the passingScore
					await assignment.save({
						'completion_passing_percent': checked && value ? value / 100.0 : null
					}, void 0, rel);

					this.setState({storedValue: value});
					this.closeMenu();
				}
			}
		}
		catch (ex) {
			this.setState({error: ex.message || ex});
		}
		finally {
			this.setState({saving: false, stateChanged: false});
		}
	}

	onCheckChange = (e) => {
		const checked = e.target.checked;
		const {checked:oldChecked} = this.state;

		if (checked !== oldChecked) {
			this.setState({
				checked,
				value: checked ? this.getValue() : null,
				stateChanged: true
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

	renderSavePrompt () {
		const {saving, totalPoints} = this.state;

		return (
			<SaveCancel
				className="input-total-points-dialog"
				getString={promptScope}
				onCancel={() => { this.setState({showPrompt: false});}}
				onSave={(e) => {
					this.onSave(e, true);
				}}
				disableSave={saving || !totalPoints}
			>
				<div className="input-total-points">
					<div className="description">{t('promptDescription')}</div>
					<Input.Number min={1} constrain value={totalPoints} onChange={(val) => { this.setState({totalPoints: val});}}/>
				</div>
			</SaveCancel>
		);
	}

	hasChanges () {
		const {value, storedValue, stateChanged} = this.state;
		const actualValue = value === 0 ? null : value;
		const actualStored = storedValue === 0 ? null : storedValue;
		return actualValue !== actualStored || stateChanged;
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
		const saveClassNames = cx('save-button flyout-fullwidth-btn', {changed: this.hasChanges()});

		return (
			<HOC.ItemChanges item={assignment} onItemChanged={this.onAssignmentChanged}>
				<Flyout.Triggered
					ref={this.setFlyoutRef}
					className="passing-score-flyout"
					horizontalAlign={Flyout.ALIGNMENTS.LEFT}
					sizing={Flyout.SIZES.MATCH_SIDE}
					trigger={this.renderTrigger()}
					onDismiss={this.reset}
					focusOnOpen={false}
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
				{this.state.showPrompt && this.renderSavePrompt()}
			</div>
		);
	}
}
