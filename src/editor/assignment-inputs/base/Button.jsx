import React from 'react';
import cx from 'classnames';
import {HOC} from 'nti-web-commons';

import {appendQuestionTo} from '../Actions';

import {hasOrderedContents} from '../../../ordered-contents';
import {Draggable} from '../../../dnd';

const QuestionMimeType = 'application/vnd.nextthought.naquestion';

const getTypes = x => (x || []).reduce((acc, type) => (acc[type] = 1, acc), {});

const getCountInQuestion = (question, types) =>
	Array.from(question || []).reduce((acc, part) =>
		(part && types[part.MimeType.toLowerCase()]) ? acc + 1 : acc, 0);


function canAddToAssignment (assignment) {
	const [part] = (assignment || {}).parts || [];
	const {question_set:questionSet} = part || {};

	return !assignment.isLocked()
		&& (!questionSet || hasOrderedContents(questionSet));
}

export class Button extends React.Component {

	static propTypes = {
		assignment: React.PropTypes.object,
		part: React.PropTypes.object,
		handles: React.PropTypes.array,
		activeInsert: React.PropTypes.object,
		label: React.PropTypes.string,
		iconCls: React.PropTypes.string
	}


	static defaultProps = {
		label: 'Add Question'
	}


	static getItem = (props) => props.assignment


	state = {}


	getBlankQuestion () {
		const {part} = this.props;

		if (part) {
			return {
				MimeType: QuestionMimeType,
				parts: [part]
			};
		}
	}


	onClick = () => {
		const {assignment, activeInsert} = this.props;
		const question = this.getBlankQuestion();

		if (question) {
			appendQuestionTo(assignment, question, activeInsert);
		}
	}


	onMouseDown = () => {
		this.setState({
			mousedown: true
		});
	}


	onMouseUp = () => {
		this.setState({
			mousedown: false
		});
	}


	getUsedCount () {
		const {assignment, handles} = this.props;
		const types = getTypes(handles);

		return assignment.getQuestions().reduce((acc, question) => acc + getCountInQuestion(question, types), 0);
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

export default HOC.ItemChanges.compose(Button);
