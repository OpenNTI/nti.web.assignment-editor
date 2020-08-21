import './Editor.scss';
import React from 'react';
import PropTypes from 'prop-types';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import {scoped} from '@nti/lib-locale';
import cx from 'classnames';
import {StickyElement, StickyContainer, Panels} from '@nti/web-commons';

import AssignmentContent from './assignment-content';
import AssignmentInfo from './info';
import AssignmentParts from './assignment-parts';
import AssignmentDiscussions from'./assignment-discussions';
import Options from './options';
import NavBar from './nav-bar';
import Placeholder from './Placeholder';

const Transition = (props) => (<CSSTransition classNames="fade-in-out" timeout={400} {...props}/>);

const CONTENT_VIEW = 'content';
const OPTIONS_VIEW = 'options';

const DEFAULT_TEXT = {
	legacy: 'The assignment contents are not available for editing. Some features may be disabled.'
};

const t = scoped('assignment.editing', DEFAULT_TEXT);


function getPartComponentForAssignment (assignment) {
	return assignment && assignment.isDiscussion ? AssignmentDiscussions : AssignmentParts;
}


export default class AssignmentEditor extends React.Component {
	static propTypes = {
		assignment: PropTypes.object,
		course: PropTypes.object,
		schema: PropTypes.object,
		gotoRoot: PropTypes.func,
		pageSource: PropTypes.object,
		readOnly: PropTypes.bool,
		previewAssignment: PropTypes.func
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
				<StickyElement>
					<NavBar gotoRoot={gotoRoot} pageSource={pageSource}/>
				</StickyElement>
				{readOnly ?
					this.renderPlaceholder(assignment, previewAssignment) :
					(
						<div>
							{assignment && !assignment.isModifiable && (<Panels.MessageBar message={t('legacy')} />)}
							<AssignmentInfo assignment={assignment} schema={schema} />
							<div className="content">
								<TransitionGroup>
									{active === CONTENT_VIEW ?
										this.renderContent(assignment, course, schema) :
										this.renderOptions(assignment, schema)
									}
								</TransitionGroup>
							</div>
						</div>
					)
				}
			</StickyContainer>
		);
	}


	renderOptions (assignment, schema) {
		return (
			<Transition key="options">
				<div className="option-container">
					<div className="show-content toggle" onClick={this.showContent}>Done</div>
					<Options assignment={assignment} schema={schema} />
				</div>
			</Transition>
		);
	}


	renderContent (assignment, course, schema) {
		const Part = getPartComponentForAssignment(assignment);
		return (
			<Transition key="content">
				<div className="content-container">
					{assignment && (
						<div className="show-options toggle" onClick={this.showOptions}>
							<i className="icon-settings small" />
							<span>Options</span>
						</div>
					)}
					<AssignmentContent assignment={assignment} course={course} schema={schema} />
					<Part assignment={assignment} course={course} schema={schema} />
				</div>
			</Transition>
		);
	}


	renderPlaceholder (assignment, previewAssignment) {
		return (
			<Placeholder assignment={assignment} previewAssignment={previewAssignment} />
		);
	}
}
