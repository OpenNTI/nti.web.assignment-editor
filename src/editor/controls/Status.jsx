import React from 'react';
import {scoped} from 'nti-lib-locale';

import {
	SAVING,
	SAVE_ENDED,
	ASSIGNMENT_ERROR,
	QUESTION_SET_ERROR,
	QUESTION_ERROR
} from '../Constants';
import Store from '../Store';

const defaultText = {
	saving: 'Saving...',
	saved: 'All Changes Saved'
};

const t = scoped('ASSIGNMENT_EDITOR_STATUS', defaultText);

export default class AssignmentStatus extends React.Component {
	constructor (props) {
		super(props);

		const {isSaving, errors} = Store;

		this.state = {
			hasUpdated: false,
			isSaving,
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

		if (type === SAVING || type === SAVE_ENDED) {
			this.onSaveChanged();
		} else if (type === ASSIGNMENT_ERROR || type === QUESTION_SET_ERROR || type === QUESTION_ERROR) {
			this.onErrorsChange();
		}
	}


	onSaveChanged () {
		const {isSaving} = this.state;

		if (isSaving !== Store.isSaving) {
			this.setState({
				hasUpdated: true,
				isSaving: Store.isSaving
			});
		}
	}


	onErrorsChanged () {
		//TODO: fill this out
	}


	render () {
		const {isSaving, hasUpdated, errors} = this.state;
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
			<span className="errors">{errors.length}</span>
		);
	}
}
