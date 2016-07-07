import React from 'react';
import cx from 'classnames';
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
		this.forceUpdate();
	}


	onQuestionMessages () {
		const {question} = this.props;
		const {NTIID} = question;
		const contentError = Store.getErrorFor(NTIID, 'content');
		const partError = Store.getErrorFor(NTIID, 'parts');
		const contentWarning = Store.getWarningFor(NTIID, 'content');

		this.setState({
			contentError,
			contentWarning,
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
		const {selectableId, selectableValue, contentError, contentWarning, partError} = this.state;
		const {isSaving} = question;
		const cls = cx('question-editor', {'is-saving': isSaving});

		return (
			<div className="assignment-editing-question-container">
				<Before question={question} />
				<Selectable className={cls} id={selectableId} value={selectableValue}>
					<div className="wrap">
						<DragHandle />
						<div className="index">{index + 1}</div>
						<Content question={question} onFocus={this.onContentFocus} onBlur={this.onContentBlur} error={contentError} warning={contentWarning}/>
					</div>
					<Parts question={question} error={partError} />
				</Selectable>
				{!isSaving && (<Controls question={question} questionSet={questionSet} assignment={assignment} />)}
			</div>
		);
	}
}
