import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import cx from 'classnames';

import {StickyContainer, Sticky} from './utils/StickyElement';
import AssignmentContent from './assignment-content';
import AssignmentInfo from './info';
import AssignmentParts from './assignment-parts';
import Options from './options';
import NavBar from './nav-bar';
import Placeholder from './Placeholder';

const CONTENT_VIEW = 'content';
const OPTIONS_VIEW = 'options';

export default class AssignmentEditor extends React.Component {
	static propTypes = {
		assignment: React.PropTypes.object,
		schema: React.PropTypes.object,
		gotoRoot: React.PropTypes.func,
		pageSource: React.PropTypes.object,
		readOnly: React.PropTypes.bool,
		previewAssignment: React.PropTypes.func
	}


	state = {
		active: CONTENT_VIEW
	}


	showContent = () => {
		this.setState({
			active: CONTENT_VIEW
		});
	}


	showOptions = () => {
		this.setState({
			active: OPTIONS_VIEW
		});
	}


	render () {
		const {assignment, schema, gotoRoot, pageSource, readOnly, previewAssignment} = this.props;
		const {active} =  this.state;
		const cls = cx('assignment-editor', {loading: !!assignment, 'read-only': readOnly});

		return (
			<StickyContainer className={cls}>
				<Sticky>
					<NavBar gotoRoot={gotoRoot} pageSource={pageSource}/>
				</Sticky>
				{readOnly ?
					this.renderPlaceholder(assignment, previewAssignment) :
					(
						<div>
							<AssignmentInfo assignment={assignment} schema={schema} />
							<div className="content">
								<ReactCSSTransitionGroup transitionName="fadeInOut" transitionEnterTimeout={400} transitionLeaveTimeout={400}>
									{active === CONTENT_VIEW ?
										this.renderContent(assignment, schema) :
										this.renderOptions(assignment, schema)
									}
								</ReactCSSTransitionGroup>
							</div>
						</div>
					)
				}
			</StickyContainer>
		);
	}


	renderOptions (assignment, schema) {
		return (
			<div key="options" className="option-container">
				<div className="show-content toggle" onClick={this.showContent}>Done</div>
				<Options assignment={assignment} schema={schema} />
			</div>
		);
	}


	renderContent (assignment, schema) {
		return (
			<div key="content" className="content-container">
				{assignment && (
					<div className="show-options toggle" onClick={this.showOptions}>
						<i className="icon-settings small" />
						<span>Options</span>
					</div>
				)}
				<AssignmentContent assignment={assignment} schema={schema} />
				<AssignmentParts assignment={assignment} schema={schema} />
			</div>
		);
	}


	renderPlaceholder (assignment, previewAssignment) {
		return (
			<Placeholder assignment={assignment} previewAssignment={previewAssignment} />
		);
	}
}
