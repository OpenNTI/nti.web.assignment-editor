import React from 'react';

import Selectable from '../utils/Selectable';
import ControlsConfig from '../controls/ControlsConfig';


export default class Before extends React.Component {
	static propTypes = {
		question: React.PropTypes.object.isRequired
	}

	constructor (props) {
		super(props);

		const {question} = props;

		this.state = {
			selectableId: question.NTIID + '-before',
			selectableValue: new ControlsConfig(null, {before: true, item: question})
		};
	}


	componentWillReceiveProps (nextProps) {
		const {question:newQuestion} = nextProps;
		const {question:oldQuestion} = this.props;

		if (newQuestion !== oldQuestion) {
			this.setState({
				selectableId: newQuestion.NTIID + '-before',
				selectableValue: new ControlsConfig(null, {before: true, item: newQuestion})
			});
		}
	}


	render () {
		const {selectableId, selectableValue} = this.state;

		return (
			<Selectable className="assignment-editor-before-question" id={selectableId} value={selectableValue} />
		);
	}
}

