import React from 'react';
import cx from 'classnames';
import {appendQuestionTo} from '../Actions';
import Draggable from '../../../dnd/Draggable';

const QuestionMimeType = 'application/vnd.nextthought.naquestion';

function getCountInQuestion (question, types) {
	const {parts} = question;

	return (parts || []).reduce((acc, part) => {
		if (types[part.MimeType.toLowerCase()]) {
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

export default class BaseButton extends React.Component {
	static propTypes = {
		assignment: React.PropTypes.object.isRequired,
		part: React.PropTypes.object.isRequired,
		handles: React.PropTypes.array,
		activeQuestion: React.PropTypes.object,
		defaultQuestionContent: React.PropTypes.string,
		label: React.PropTypes.string,
		iconCls: React.PropTypes.string
	}

	label = 'Add Question'
	defaultQuestionContent = 'Blank Question'


	constructor (props) {
		super(props);

		this.state = {};

		this.onClick = this.onClick.bind(this);
	}


	getBlankQuestion () {
		const {part} = this.props;

		if (part) {
			return {
				MimeType: part.MimeType || this.QuestionMimeType,
				content: part.content || this.defaultQuestionContent,
				parts: [part]
			};
		}
	}


	onClick () {
		const {assignment, activeQuestion} = this.props;
		const question = this.getBlankQuestion();

		if (question) {
			appendQuestionTo(assignment, question, activeQuestion);
		}
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


	onDragStart () {
		console.log('Button on Drag start', arguments);
	}


	onDragEnd () {
		console.log('Button on Drag end', arguments);
	}


	render () {
		let {label,iconCls} = this.props;
		const icnCls = cx('icon', iconCls);
		const usedCount = this.getUsedCount();
		const usedCls = cx('used', {isUsed: usedCount > 0});
		const data = this.getBlankQuestion() || {};
		const cls = cx('button');

		if (!label) {
			label = this.label;
		}

		return (
			<Draggable data={data} className={cls}>
				<div className={cls} onClick={this.onClick}>
					<div className="icon-wrapper">
						<div className={icnCls}></div>
					</div>
					<div className="label">{label}</div>
					<div className={usedCls}>{usedCount} used</div>
				</div>
			</Draggable>
		);
	}
}
