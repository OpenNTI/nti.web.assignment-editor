import React from 'react';
import {Panels} from 'nti-web-commons';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import {scoped} from 'nti-lib-locale';
import cx from 'classnames';

import {StickyContainer, Sticky} from './utils/StickyElement';
import AssignmentContent from './assignment-content';
import AssignmentInfo from './info';
import AssignmentParts from './assignment-parts';
import AssignmentDiscussions from'./assignment-discussions';
import Options from './options';
import NavBar from './nav-bar';
import Placeholder from './Placeholder';

const CONTENT_VIEW = 'content';
const OPTIONS_VIEW = 'options';

const DEFAULT_TEXT = {
	legacy: 'The assignment contents are not available for editing. Some features may be disabled.'
};

const t = scoped('ASSIGNMENT_EDITOR', DEFAULT_TEXT);


function getPartComponentForAssignment (assignment) {
	return assignment && assignment.isDiscussion ? AssignmentDiscussions : AssignmentParts;
}


export default class AssignmentEditor extends React.Component {
	static propTypes = {
		assignment: React.PropTypes.object,
		course: React.PropTypes.object,
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
		const {assignment, course, schema, gotoRoot, pageSource, readOnly, previewAssignment} = this.props;
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
							{assignment && !assignment.canEdit() && (<Panels.MessageBar message={t('legacy')} />)}
							<AssignmentInfo assignment={assignment} schema={schema} />
							<div className="content">
								<ReactCSSTransitionGroup transitionName="fadeInOut" transitionEnterTimeout={400} transitionLeaveTimeout={400}>
									{active === CONTENT_VIEW ?
										this.renderContent(assignment, course, schema) :
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


	renderContent (assignment, course, schema) {
		const Part = getPartComponentForAssignment(assignment);
		return (
			<div key="content" className="content-container">
				{assignment && (
					<div className="show-options toggle" onClick={this.showOptions}>
						<i className="icon-settings small" />
						<span>Options</span>
					</div>
				)}
				<AssignmentContent assignment={assignment} course={course} schema={schema} />
				<Part assignment={assignment} course={course} schema={schema} />
			</div>
		);
	}


	renderPlaceholder (assignment, previewAssignment) {
		return (
			<Placeholder assignment={assignment} previewAssignment={previewAssignment} />
		);
	}
}
