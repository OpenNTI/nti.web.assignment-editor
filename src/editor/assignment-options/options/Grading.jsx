import React, { PropTypes } from 'react';
import {scoped} from 'nti-lib-locale';

import OptionGroup from '../OptionGroup';
import Option from '../Option';

const DEFAULT_TEXT = {
	content: 'Save time with auto grading.',
	label: 'Enable Auto Grading'
};

const t = scoped('OPTIONS_GRADING', DEFAULT_TEXT);

export default class Grading extends React.Component {
	static propTypes = {
		assignment: PropTypes.object.isRequired
	}

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
		const {assignment} = this.props;
		const {isAutoGraded} = this.state;

		if (assignment.isAutoGraded !== isAutoGraded) {
			assignment.setAutoGrade(isAutoGraded)
				.catch(error => {
					this.setState({isAutoGraded: assignment.isAutoGraded, error});
				});
		}
	}


	setupValue (props = this.props) {
		const setState = s => this.state ? this.setState(s) : (this.state = s);
		const {assignment: {isAutoGraded}} = props;

		setState({ isAutoGraded });
	}


	onItemChanged = () => {
		this.setupValue();
	}


	onChange = () => {
		const {isAutoGraded} = this.state;
		this.setState({isAutoGraded: !isAutoGraded, error: null});
	}


	render () {
		const {assignment} = this.props;
		const {isAutoGraded, error} = this.state;
		const disabled = !assignment.hasLink('edit');

		const errorMessage = error && (
			error.message
		);

		return (
			<OptionGroup name="grading" header="Grading" content={t('content')} error={errorMessage}>
				<Option label={t('label')} name="auto-grading" value={isAutoGraded} onChange={this.onChange} disabled={disabled}/>
			</OptionGroup>
		);
	}
}
