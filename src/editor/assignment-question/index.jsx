import React from 'react';
import cx from 'classnames';
import {Errors} from 'nti-web-commons';
import autobind from 'nti-commons/lib/autobind';

import {DragHandle} from '../../dnd';

import Store from '../Store';
import {QUESTION_ERROR, QUESTION_WARNING} from '../Constants';
import Selectable from '../utils/Selectable';
import ControlsConfig from '../controls/ControlsConfig';

import Before from './Before';
import Content from './Content';
import Parts from './Parts';
import Controls from './controls';

const {Field:{Component:ErrorCmp}} = Errors;

function isKnownPartError (error) {
	if (!error) { return false; }

	const known = {choices: true, values: true, labels: true};
	const {raw} = error;

	return known[raw.field] && raw.index;
}

export default class QuestionComponent extends React.Component {
	static propTypes = {
		question: React.PropTypes.object.isRequired,
		questionSet: React.PropTypes.object.isRequired,
		assignment: React.PropTypes.object.isRequired,
		index: React.PropTypes.number
	}

	constructor (props) {
		super(props);

		const {question} = this.props;

		this.state = {
			selectableId: question.NTIID,
			selectableValue: new ControlsConfig(null, {after: true, item: question})
		};

		autobind(this,
			'onContentFocus',
			'onContentBlur',
			'onStoreChange',
			'onQuestionChange'
		);
	}


	componentDidMount () {
		const {question} = this.props;

		Store.addChangeListener(this.onStoreChange);

		if (question && question.addListener) {
			question.addListener('change', this.onQuestionChange);
		}
	}


	componentWillUnmount () {
		const {question} = this.props;

		Store.removeChangeListener(this.onStoreChange);

		if (question && question.removeListener) {
			question.removeListener('change', this.onQuestionChange);
		}
	}


	onStoreChange (data) {
		if (data.type === QUESTION_ERROR || data.type === QUESTION_WARNING) {
			this.onQuestionMessages();
		}
	}


	onQuestionChange () {
		const {questionError} = this.state;

		if (questionError && questionError.clear) {
			questionError.clear();
		} else {
			this.forceUpdate();
		}
	}


	onQuestionMessages () {
		const {question} = this.props;
		const {NTIID} = question;
		const contentError = Store.getErrorFor(NTIID, 'content');
		const contentWarning = Store.getWarningFor(NTIID, 'content');
		const partsError = Store.getErrorFor(NTIID, 'parts');
		let partError;
		let questionError;

		if (isKnownPartError(partsError)) {
			partError = partsError;
		} else {
			questionError = partsError;
		}

		this.setState({
			contentError,
			contentWarning,
			questionError,
			partError
		});
	}


	onContentFocus (editor) {
		const {question} = this.props;

		this.setState({
			selectableValue: new ControlsConfig(editor, question)
		});
	}


	onContentBlur () {
		const {question} = this.props;

		this.setState({
			selectableValue: new ControlsConfig(null, {after: true, item: question})
		});
	}


	render () {
		const {question, index, questionSet, assignment} = this.props;
		const {selectableId, selectableValue, contentError, contentWarning, partError, questionError} = this.state;
		const {isSaving} = question;
		const cls = cx('question-editor', {'is-saving': isSaving, error: contentError || questionError || question.error});

		return (
			<div className="assignment-editing-question-container">
				<Before question={question} />
				<Selectable className={cls} id={selectableId} value={selectableValue}>
					<div className="wrap">
						<DragHandle className="question-drag-handle" />
						<div className="index">{index + 1}</div>
						<Content question={question} onFocus={this.onContentFocus} onBlur={this.onContentBlur} error={contentError} warning={contentWarning}/>
					</div>
					<Parts question={question} error={partError} />
					{questionError && (<ErrorCmp error={questionError} />)}
				</Selectable>
				{!isSaving && (<Controls question={question} questionSet={questionSet} assignment={assignment} />)}
			</div>
		);
	}
}
