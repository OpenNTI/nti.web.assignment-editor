import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {scoped} from '@nti/lib-locale';
import {Errors, DialogButtons} from '@nti/web-commons';
import naturalSort from 'node-natural-sort';

const {Field: {List:ErrorList}} = Errors;

const DEFAULT_TEXT = {
	title: 'Are you sure?',
	errorMessage: 'One or more questions could not be saved and will revert to a previous version.',
	warningMessage: 'One or more questions are blank.',
	seeErrors: 'View Details',
	seeWarnings: 'View Details',
	errorHeader: 'Errors',
	warningHeader: 'Caution',
	continue: 'Publish Anyway',
	cancel: 'Keep Editing'
};

const t = scoped('assignment.editing.controls.publish.confirmation', DEFAULT_TEXT);

export default class PrepublishModal extends React.Component {
	static propTypes = {
		errors: PropTypes.array,
		warnings: PropTypes.array,
		onDismiss: PropTypes.func,
		confirm: PropTypes.func,
		reject: PropTypes.func
	}

	errorButtons = [
		{label: t('cancel'), onClick: () => this.onCancel()},
		{label: t('continue'), onClick: () => this.onContinue(), className: 'caution'}
	]


	warningButtons = [
		{label: t('cancel'), onClick: () => this.onCancel()},
		{label: t('continue'), onClick: () => this.onContinue(), className: 'warning'}
	]


	constructor (props) {
		super(props);

		this.state = {
			collapsed: true
		};
	}


	get hasErrors () {
		const {errors} = this.props;

		return errors && errors.length > 0;
	}


	get hasWarnings () {
		const {warnings} = this.props;

		return warnings && warnings.length > 0;
	}


	doExpand = () => {
		this.setState({
			collapsed: false
		});
	}


	onCancel = () => {
		const {reject, onDismiss} = this.props;

		if (reject) {
			reject();
		}

		if (onDismiss) {
			onDismiss();
		}
	}


	onContinue = () => {
		const {confirm, onDismiss} = this.props;

		if (confirm) {
			confirm();
		}

		if (onDismiss) {
			onDismiss();
		}
	}


	render () {
		const {hasErrors, hasWarnings} = this;
		const errorMessage = hasErrors && t('errorMessage');
		const warningMessage = hasWarnings && t('warningMessage');
		const buttonConfig = hasErrors ? this.errorButtons : hasWarnings ? this.warningButtons : null;
		const cls = cx('inner', {error: hasErrors, warning: !hasErrors && hasWarnings});


		return (
			<div className="assignment-confirm-publish">
				<div className={cls}>
					<i className="icon-remove" onClick={this.onCancel}/>
					<i className="icon-alert" />
					<div className="message">
						<h3>{t('title')}</h3>
						{errorMessage && (<div className="content"> {errorMessage}</div>)}
						{warningMessage && (<div className="content"> {warningMessage}</div>)}
						{this.renderExpand()}
					</div>
					{(hasErrors || hasWarnings) && this.renderIssues()}
				</div>
				{buttonConfig && (<DialogButtons buttons={buttonConfig}/>)}
			</div>
		);
	}


	renderExpand () {
		const {hasErrors, hasWarnings} = this;
		const {collapsed} = this.state;
		const text = hasErrors ? t('seeErrors') : hasWarnings ? t('seeWarnings') : null;

		return text && collapsed ? (<div className="expand" onClick={this.doExpand}>{text}</div>) : null;
	}


	renderIssues () {
		let {errors, warnings} = this.props;
		const {hasErrors, hasWarnings} = this;
		const {collapsed} = this.state;
		const cls = cx('issues', {collapsed, 'has-both': hasErrors && hasWarnings});
		const compare = naturalSort({caseSensitive: false});

		const compareIssues = (a, b) => {
			a = a && a.attachedTo && a.attachedTo.label;
			b = b && b.attachedTo && b.attachedTo.label;
			return compare(a, b);
		};

		if (Array.isArray(errors)) {
			errors = errors.sort(compareIssues);
		}

		if (Array.isArray(warnings)) {
			warnings = warnings.sort(compareIssues);
		}

		return (
			<div className={cls} onClick={this.onIssueClick}>
				{hasErrors && hasWarnings && (<div className="header error">{t('errorHeader')}</div>)}
				{hasErrors && (<ErrorList errors={errors} onErrorFocus={this.onCancel} />)}
				{hasErrors && hasWarnings && (<div className="header warning">{t('warningHeader')}</div>)}
				{hasWarnings && (<ErrorList errors={warnings} isWarnings onErrorFocus={this.onCancel} />)}
			</div>
		);
	}
}
