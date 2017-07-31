import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from 'nti-lib-locale';
import {HOC} from 'nti-web-commons';

import OptionGroup from './OptionGroup';
import Option from './Option';

const DEFAULT_TEXT = {
	content: 'Save time with auto grading.',
	label: 'Enable Auto Grading',
	'disabled-no-questions': 'Add some questions to enable this option.',
	'disabled-total-points': 'Assignment must have a point value to enable auto grading.',
	'disabled-conflicting-questions': {
		other: 'Essays and file uploads are question types that are not compatible with auto grading. You must remove questions %(conflicts)s before enabling auto grade.',
		one: 'Essays and file uploads are question types that are not compatible with auto grading. You must remove question %(conflicts)s before enabling auto grade.'
	}
};

const t = scoped('assignment.editing.options.grading', DEFAULT_TEXT);

class Grading extends React.Component {
	static propTypes = {
		assignment: PropTypes.object,
		questionSet: PropTypes.object
	}

	static getItem = (props) => props.assignment


	constructor (props) {
		super();

		this.setupValue(props);
	}

	componentDidUpdate () {
		const {assignment} = this.props;
		const {isAutoGraded} = this.state;

		if (assignment.isAutoGraded !== isAutoGraded) {
			this.save();
		}
	}


	componentWillReceiveProps (nextProps) {
		if (this.props.assignment !== nextProps.assignment) {
			this.setupValue(nextProps);
		}
	}


	save = () => {
		const {assignment, questionSet} = this.props;
		const {isAutoGraded} = this.state;

		if (questionSet.isAutoGradable && assignment.isAutoGraded !== isAutoGraded) {
			assignment.setAutoGrade(isAutoGraded)
				.catch(error => {
					this.setState({isAutoGraded: assignment.isAutoGraded, error});
				});
		}
	}


	setupValue (props = this.props) {
		const setState = s => this.state ? this.setState(s) : (this.state = s);
		const {assignment, questionSet} = props;
		let {isAutoGraded} = assignment || {};

		let conflicts = null;

		if (questionSet && !questionSet.isAutoGradable) {
			// dance around the model being stale (if they add a question after this is on...
			// and they confirm that they want to add that question... the server will turn
			// this off, and we wont know until we refresh the assignment.)
			isAutoGraded = false;
			conflicts = questionSet.getAutoGradableConflicts();

			conflicts = t('disabled-conflicting-questions', {
				count: conflicts.length,
				conflicts: conflicts.map(x => x.index + 1).join(', ')
			});
		}

		setState({isAutoGraded, conflicts});
	}


	onItemChanged = () => {
		this.setupValue();
	}


	onChange = () => {
		const {isAutoGraded} = this.state;
		this.setState({isAutoGraded: !isAutoGraded, error: null});
	}


	render () {
		const {assignment, questionSet} = this.props;
		const {isAutoGraded, conflicts, error} = this.state;
		const disabled = assignment && (!assignment.canSetAutoGrade() || !assignment.totalPoints);

		const errorMessage = error && ( error.message );

		return (
			<OptionGroup
				name="grading"
				header="Grading"
				content={t('content')}
				error={conflicts || errorMessage}
				disabled={!questionSet || Boolean(conflicts) || !assignment.totalPoints || !assignment.canSetAutoGrade()}
				disabledText={questionSet ? (assignment.totalPoints ? '' : t('disabled-total-points')) : t('disabled-no-questions')}
			>
				<Option label={t('label')} name="auto-grading" value={isAutoGraded} onChange={this.onChange} disabled={disabled}/>
			</OptionGroup>
		);
	}
}

export default HOC.ItemChanges.compose(Grading);
