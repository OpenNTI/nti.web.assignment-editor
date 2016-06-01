import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import cx from 'classnames';

import AssignmentInfo from '../assignment-info';
import AssignmentParts from '../assignment-parts';
import AssignmentContent from '../assignment-content';
import AssignmentOptions from '../assignment-options';

const CONTENT_VIEW = 'content';
const OPTIONS_VIEW = 'options';

export default class AssignmentEditor extends React.Component {
	static propTypes = {
		assignment: React.PropTypes.object,
		schema: React.PropTypes.object
	}


	constructor (props) {
		super(props);

		this.state = {
			active: CONTENT_VIEW
		};

		this.showContent = this.showContent.bind(this);
		this.showOptions = this.showOptions.bind(this);
	}


	showContent () {
		this.setState({
			active: CONTENT_VIEW
		});
	}


	showOptions () {
		this.setState({
			active: OPTIONS_VIEW
		});
	}


	render () {
		const {assignment, schema} = this.props;
		const {active} =  this.state;
		const cls = cx('assignment-editor', {loading: !!assignment});

		return (
			<div className={cls}>
				<AssignmentInfo assignment={assignment} schema={schema} />
				<div className="content">
					<div className="control">
						{active === CONTENT_VIEW ?
							(<div className="show-options" onClick={this.showOptions}>Options</div>) :
							(<div className="show-content" onClick={this.showContent}>Content</div>)
						}
					</div>
					<ReactCSSTransitionGroup transitionName="fadeInOut" transitionEnterTimeout={500} transitionLeaveTimeout={500}>
						{active === CONTENT_VIEW ?
							this.renderContent(assignment, schema) :
							this.renderOptions(assignment, schema)
						}
					</ReactCSSTransitionGroup>
				</div>
			</div>
		);
	}


	renderOptions (assignment, schema) {
		return (
			<div key="options" className="option-container">
				<AssignmentOptions assignment={assignment} schema={schema} />
			</div>
		);
	}


	renderContent (assignment, schema) {
		return (
			<div key="content" className="content-container">
				<AssignmentContent assignment={assignment} schema={schema} />
				<AssignmentParts assignment={assignment} schema={schema} />
			</div>
		);
	}
}
