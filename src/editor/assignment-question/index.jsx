import React from 'react';
import cx from 'classnames';

import Store from '../Store';
import {QUESTION_ERROR} from '../Constants';
import Selectable from '../utils/Selectable';

import Content from './Content';
import Parts from './Parts';
import Controls from './Controls';

export default class QuestionComponent extends React.Component {
	static propTypes = {
		question: React.PropTypes.object.isRequired,
		questionSet: React.PropTypes.object.isRequired,
		index: React.PropTypes.number
	}

	constructor (props) {
		super(props);

		this.state = {
			selectableId: this.props.question.NTIID,
			selectableValue: this.props.question.content
		};

		this.onContentFocus = this.onContentFocus.bind(this);
		this.onContentBlur = this.onContentBlur.bind(this);
		this.onStoreChange = this.onStoreChange.bind(this);
		this.onQuestionChange = this.onQuestionChange.bind(this);
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
		if (data.type === QUESTION_ERROR) {
			this.onQuestionError();
		}
	}


	onQuestionChange () {
		this.forceUpdate();
	}


	onQuestionError () {
		const {question} = this.props;
		const {NTIID} = question;
		const contentError = Store.getErrorFor(NTIID, 'content');
		const partError = Store.getErrorFor(NTIID, 'parts');

		this.setState({
			contentError,
			partError
		});
	}


	onContentFocus () {
		const {question} = this.props;

		this.setState({
			selectableValue: question.content + ' FOCUSED'
		});
	}


	onContentBlur () {
		const {question} = this.props;

		this.setState({
			selectableValue: question.content
		});
	}


	render () {
		const {question} = this.props;
		const {selectableId, selectableValue, contentError, partError} = this.state;
		const cls = cx('question-editor', {saving: question.isSaving});

		return (
			<div className="question-container">
				<Selectable className={cls} id={selectableId} value={selectableValue}>
					<Content question={question} onFocus={this.onContentFocus} onBlur={this.onContentBlur} error={contentError}/>
					<Parts question={question} error={partError} />
				</Selectable>
				<Controls question={question} />
			</div>
		);
	}
}
