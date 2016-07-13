import React from 'react';
import autobind from 'nti-commons/lib/autobind';

import Store from '../../Store';
import {ASSIGNMENT_ERROR} from '../../Constants';

import {saveTitle, saveContent} from '../Actions';
import Title from './Title';
import Content from './Content';

export default class AssignmentContentView extends React.Component {
	static propTypes = {
		assignment: React.PropTypes.object,
		schema: React.PropTypes.object
	}

	constructor (props) {
		super(props);

		const {assignment} = props;
		let title = '';
		let content = '';


		if (assignment) {
			title = assignment.title;
			content = assignment.content;
		}

		this.state = {
			title: title,
			content: content,
			errors: {}
		};

		autobind(this,
			'onStoreChange',
			'onAssignmentChange',
			'onTitleChange',
			'onContentChange'
		);
	}


	componentWillReceiveProps (nextProps) {
		const {assignment} = nextProps;

		this.setState({
			title: (assignment && assignment.title) || '',
			content: (assignment && assignment.content) || ''
		});
	}


	componentDidMount () {
		Store.addChangeListener(this.onStoreChange);
	}


	componentWillUnmount () {
		Store.addChangeListener(this.onStoreChange);
	}


	onStoreChange (data) {
		if (data.type === ASSIGNMENT_ERROR) {
			this.onAssignmentError();
		}
	}


	onAssignmentChange () {

	}


	onAssignmentError () {
		const {assignment} = this.props;
		const {NTIID} = assignment;

		this.setState({
			titleError: Store.getErrorFor(NTIID, 'title'),
			contentError: Store.getErrorFor(NTIID, 'content')
		});
	}


	onTitleChange (value, maxLength) {
		const {assignment} = this.props;

		saveTitle(assignment, value, maxLength);
	}


	onContentChange (value) {
		const {assignment} = this.props;

		saveContent(assignment, value);
	}


	render () {
		const {assignment, schema} = this.props;
		const {title, content, titleError, contentError} = this.state;

		if (!assignment) {
			return (
				<div className="assignment-content loading"></div>
			);
		}

		return (
			<div className="assignment-content">
				<Title value={title} schema={schema} onChange={this.onTitleChange} error={titleError} />
				<Content value={content} schema={schema} onChange={this.onContentChange} error={contentError} />
			</div>
		);
	}
}