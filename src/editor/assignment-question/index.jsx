import React from 'react';
import Selectable from '../utils/Selectable';
import Content from './Content';
import Parts from './Parts';

export default class QuestionComponent extends React.Component {
	static propTypes = {
		Question: React.PropTypes.object.isRequired
	}

	constructor (props) {
		super(props);

		this.state = {
			selectableId: this.props.Question.NTIID,
			selectableValue: this.props.Question.content
		};

		this.onContentFocus = this.onContentFocus.bind(this);
		this.onContentBlur = this.onContentBlur.bind(this);
	}


	onContentFocus () {
		const {Question} = this.props;

		this.setState({
			selectableValue: Question.content + ' FOCUSED'
		});
	}


	onContentBlur () {
		const {Question} = this.props;

		this.setState({
			selectableValue: Question.content
		});
	}


	render () {
		const {Question} = this.props;
		const {selectableId, selectableValue} = this.state;

		return (
			<Selectable className="question" id={selectableId} value={selectableValue}>
				<Content Question={Question} onFocus={this.onContentFocus} onBlur={this.onContentBlur}/>
				<Parts Question={Question} />
			</Selectable>
		);
	}
}
