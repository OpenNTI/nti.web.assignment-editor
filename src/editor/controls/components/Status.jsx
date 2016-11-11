import React from 'react';
import {Errors} from 'nti-web-commons';
import {scoped} from 'nti-lib-locale';

import {
	ASSIGNMENT_ERROR,
	QUESTION_SET_ERROR,
	QUESTION_ERROR,
	REVERT_ERRORS
} from '../../Constants';
import Store from '../../Store';

const {Field: {FlyoutList:ErrorFlyoutList}} = Errors;

const defaultText = {
	saving: 'Saving...',
	saved: 'All Changes Saved'
};

const t = scoped('ASSIGNMENT_EDITOR_STATUS', defaultText);

export default class AssignmentStatus extends React.Component {
	static propTypes = {
		hasUpdated: React.PropTypes.bool,
		isSaving: React.PropTypes.bool
	}

	constructor (props) {
		super(props);

		const {errors} = Store;

		this.state = {
			errors
		};
	}


	componentDidMount () {
		this.addListeners();
	}


	componentWillUnmount () {
		this.removeListeners();
	}


	addListeners () {
		this.removeListeners();
		Store.addChangeListener(this.onStoreChange);
	}


	removeListeners () {
		Store.removeChangeListener(this.onStoreChange);
	}


	onStoreChange = (data) => {
		const {type} = data;

		if (type === REVERT_ERRORS || type === ASSIGNMENT_ERROR || type === QUESTION_SET_ERROR || type === QUESTION_ERROR) {
			this.onErrorsChanged();
		}
	}


	onErrorsChanged () {
		const {errors:oldErrors} = this.state;
		const {errors:newErrors} = Store;

		if (oldErrors !== newErrors) {
			this.setState({
				errors: newErrors
			});
		}
	}


	render () {
		const {isSaving, hasUpdated} = this.props;
		const {errors} = this.state;
		const hasErrors = errors.length > 0;

		return (
			<div className="assignment-editor-status">
				{
					hasErrors && !isSaving ?
						this.renderErrors(errors) :
						this.renderStatus(isSaving, hasUpdated)
				}
			</div>
		);
	}


	renderStatus (isSaving, hasUpdated) {
		let text;

		//If we have updated and we aren't saving show saved text
		if (hasUpdated && !isSaving) {
			text = t('saved');
		} else if (isSaving) {
			text = t('saving');
		}

		return (
			<span className="status">{text}</span>
		);
	}


	renderErrors (errors) {
		return (
			<ErrorFlyoutList errors={errors} />
		);
	}
}
