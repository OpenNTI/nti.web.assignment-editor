import React from 'react';
import cx from 'classnames';
import autobind from 'nti-commons/lib/autobind';

import {appendQuestionTo} from '../Actions';

import {hasOrderedContents} from '../../../ordered-contents';
import Draggable from '../../../dnd/Draggable';

const QuestionMimeType = 'application/vnd.nextthought.naquestion';

function getCountInQuestion (question, types) {
	const {parts} = question || {};

	return (parts || []).reduce((acc, part) => {
		if (part && types[part.MimeType.toLowerCase()]) {
			acc += 1;
		}

		return acc;
	}, 0);
}


function getCountInPart (part, types) {
	const {question_set:questionSet} = part;
	const {questions} = questionSet;

	return (questions || []).reduce((acc, question) => {
		return acc + getCountInQuestion(question, types);
	}, 0);
}


function canAddToAssignment (assignment) {
	const {parts} = assignment;
	const part = parts && parts[0];

	//TODO: replace true with a condition to check if the assignment can take parts.
	if (!part && !true) {
		return true;
	}

	const {question_set:questionSet} = part;

	return questionSet && hasOrderedContents(questionSet);
}

export default class BaseButton extends React.Component {
	static propTypes = {
		assignment: React.PropTypes.object.isRequired,
		part: React.PropTypes.object.isRequired,
		handles: React.PropTypes.array,
		activeInsert: React.PropTypes.object,
		label: React.PropTypes.string,
		iconCls: React.PropTypes.string
	}

	static defaultProps = {
		label: 'Add Question'
	}

	constructor (props) {
		super(props);

		this.state = {
			mousedown: false
		};

		autobind(this,
			'onClick',
			'onMouseDown',
			'onMouseUp'
		);
	}


	getBlankQuestion () {
		const {part} = this.props;

		if (part) {
			return {
				MimeType: QuestionMimeType,
				parts: [part]
			};
		}
	}


	onClick () {
		const {assignment, activeInsert} = this.props;
		const question = this.getBlankQuestion();

		if (question) {
			appendQuestionTo(assignment, question, activeInsert);
		}
	}


	onMouseDown () {
		this.setState({
			mousedown: true
		});
	}


	onMouseUp () {
		this.setState({
			mousedown: false
		});
	}


	getUsedCount () {
		const {assignment, handles} = this.props;
		let types = handles || [];

		types = types.reduce((acc, type) => {
			acc[type] = true;

			return acc;
		}, {});

		return (assignment.parts || []).reduce((acc, part) => {
			return acc + getCountInPart(part, types);
		}, 0);
	}


	render () {
		let {label, iconCls, assignment} = this.props;
		const {mousedown} = this.state;
		const icnCls = cx('icon', iconCls);
		const usedCount = this.getUsedCount();
		const usedCls = cx('used', {isUsed: usedCount > 0});
		const data = this.getBlankQuestion() || {};
		const cls = cx('assigment-editor-sidebar-button', {mousedown, disabled: !canAddToAssignment(assignment)});

		return (
			<Draggable data={data} className={cls} onMouseDown={this.onMouseDown} onMouseUp={this.onMouseUp} onDragEnd={this.onMouseUp}>
				<div className={cls} onClick={this.onClick} >
					<div className="icon-wrapper">
						<div className={icnCls}></div>
					</div>
					<div className="label">{label}</div>
					<div className={usedCls}>{usedCount}</div>
				</div>
			</Draggable>
		);
	}
}
