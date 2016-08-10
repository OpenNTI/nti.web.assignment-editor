import React from 'react';
import cx from 'classnames';
import {scoped} from 'nti-lib-locale';
import {Errors, DialogButtons} from 'nti-web-commons';

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

const t = scoped('ASSIGNMENT_ASSIGNMENT_PUBLISH_CONFIRMATION', DEFAULT_TEXT);

export default class PrepublishModal extends React.Component {
	static propTypes = {
		errors: React.PropTypes.array,
		warnings: React.PropTypes.array,
		onDismiss: React.PropTypes.func,
		confirm: React.PropTypes.func,
		reject: React.PropTypes.func
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

		const compareWarnings = (a, b) => {
			a = a && a.attachedTo && a.attachedTo.label;
			b = b && b.attachedTo && b.attachedTo.label;
			if (typeof a === 'string' && typeof b === 'string') {
				a = Number(a.split(' ')[a.split(' ').length - 1]);
				b = Number(b.split(' ')[b.split(' ').length - 1]);
				if (!isNaN(a) && !isNaN(b)) {
					return a < b ? -1 : a === b ? 0 : 1;
				} else if (!isNaN(a)) {
					return -1;
				} else if (!isNaN(b)) {
					return 1;
				} else {
					return 0;
				}
			} else if (typeof a === 'string') {
				return -1;
			} else if (typeof b === 'string') {
				return 1;
			} else {
				return 0;
			}
		};

		if (Array.isArray(warnings)) {
			warnings = warnings.sort(compareWarnings);
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
