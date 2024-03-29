import './Editor.scss';
import React from 'react';
import PropTypes from 'prop-types';

import QuestionTypes from './QuestionTypes';
import TabBar from './Header';

const QUESTION_TYPE = 'application/vnd.nextthought.naquestion';

function getActiveQuestionInsertFromSelection(selection) {
	const activeSelection = selection && selection[0]; //For now just look at the first one
	const activeInsert =
		activeSelection &&
		activeSelection.value &&
		activeSelection.value.insertAt;
	const item = activeInsert && activeInsert.item;

	return item && item.MimeType === QUESTION_TYPE ? activeInsert : null;
}

export default class Editor extends React.Component {
	static propTypes = {
		assignment: PropTypes.object,
		schema: PropTypes.object,
		selection: PropTypes.any,
		readOnly: PropTypes.bool,
	};

	static contextTypes = {
		SelectionManager: PropTypes.shape({
			select: PropTypes.func,
			unselect: PropTypes.func,
		}),
	};

	constructor(props) {
		super(props);

		this.state = {};
	}

	componentDidMount() {
		const { SelectionManager } = this.context;

		if (SelectionManager) {
			SelectionManager.addListener(
				'selection-changed',
				this.selectionChanged
			);
			this.selectionChanged(SelectionManager.getSelection());
		}
	}

	componentWillUnmount() {
		const { SelectionManager } = this.context;

		if (SelectionManager) {
			SelectionManager.removeListener(
				'selection-changed',
				this.selectionChanged
			);
		}
	}

	selectionChanged = selection => {
		this.setState({
			selection,
		});
	};

	render() {
		const { assignment, schema, readOnly } = this.props;
		const { selection } = this.state;

		const activeInsert = getActiveQuestionInsertFromSelection(selection);

		if (!assignment) {
			return <div className="assignment-editing-sidebar loading" />;
		}

		return (
			<div className="assignment-editing-sidebar">
				<TabBar />
				<QuestionTypes
					assignment={assignment}
					schema={schema}
					selection={selection}
					activeInsert={activeInsert}
					readOnly={readOnly}
				/>
			</div>
		);
	}
}
