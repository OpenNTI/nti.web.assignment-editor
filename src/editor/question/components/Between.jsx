import './Between.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import {Component as Selectable} from '../../../selection';
import ControlsConfig from '../../controls/ControlsConfig';


export default class Between extends React.Component {
	static propTypes = {
		question: PropTypes.object.isRequired,
		before: PropTypes.bool,
		after: PropTypes.bool
	}

	constructor (props) {
		super(props);

		const {question, before, after} = props;

		this.state = {
			selectableId: question.NTIID + '-' + (before ? 'before' : 'after'),
			selectableValue: new ControlsConfig(null, {before, after, item: question})
		};
	}


	componentDidUpdate (prevProps) {
		const {question:newQuestion, before, after} = this.props;
		const {question:oldQuestion} = prevProps;

		if (newQuestion !== oldQuestion) {
			this.setState({
				selectableId: newQuestion.NTIID + '-' + (before ? 'before' : 'after'),
				selectableValue: new ControlsConfig(null, {before, after, item: newQuestion})
			});
		}
	}


	render () {
		const {before, after} = this.props;
		const {selectableId, selectableValue} = this.state;
		const cls = cx('assignment-editor-between-question', {before, after});

		return (
			<Selectable className={cls} id={selectableId} value={selectableValue} tabIndex="0" />
		);
	}
}
