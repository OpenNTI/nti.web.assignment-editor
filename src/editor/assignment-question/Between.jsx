import React from 'react';
import cx from 'classnames';

import Selectable from '../utils/Selectable';
import ControlsConfig from '../controls/ControlsConfig';


export default class Between extends React.Component {
	static propTypes = {
		question: React.PropTypes.object.isRequired,
		before: React.PropTypes.bool,
		after: React.PropTypes.bool
	}

	constructor (props) {
		super(props);

		const {question, before, after} = props;

		this.state = {
			selectableId: question.NTIID + '-' + (before ? 'before' : 'after'),
			selectableValue: new ControlsConfig(null, {before, after, item: question})
		};
	}


	componentWillReceiveProps (nextProps) {
		const {question:newQuestion, before, after} = nextProps;
		const {question:oldQuestion} = this.props;

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

