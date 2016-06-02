import React from 'react';
import cx from 'classnames';
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
		const {selectableId, selectableValue} = this.state;
		const cls = cx('question-editor', {saving: question.isSaving});

		return (
			<div className="question-container">
				<Selectable className={cls} id={selectableId} value={selectableValue}>
					<Content question={question} onFocus={this.onContentFocus} onBlur={this.onContentBlur}/>
					<Parts question={question} />
				</Selectable>
				<Controls question={question} />
			</div>
		);
	}
}
