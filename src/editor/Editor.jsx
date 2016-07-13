import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import cx from 'classnames';

import {StickyContainer, Sticky} from './utils/StickyElement';
import AssignmentInfo from './assignment-info';
import AssignmentParts from './assignment-parts';
import AssignmentContent from './assignment-content';
import AssignmentOptions from './assignment-options';
import NavBar from './nav-bar';

const CONTENT_VIEW = 'content';
const OPTIONS_VIEW = 'options';

export default class AssignmentEditor extends React.Component {
	static propTypes = {
		assignment: React.PropTypes.object,
		schema: React.PropTypes.object,
		gotoRoot: React.PropTypes.func,
		pageSource: React.PropTypes.object
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
		const {assignment, schema, gotoRoot, pageSource} = this.props;
		const {active} =  this.state;
		const cls = cx('assignment-editor', {loading: !!assignment});

		return (
			<StickyContainer className={cls}>
				<Sticky>
					<NavBar gotoRoot={gotoRoot} pageSource={pageSource}/>
				</Sticky>
				<AssignmentInfo assignment={assignment} schema={schema} />
				<div className="content">
					<ReactCSSTransitionGroup transitionName="fadeInOut" transitionEnterTimeout={400} transitionLeaveTimeout={400}>
						{active === CONTENT_VIEW ?
							this.renderContent(assignment, schema) :
							this.renderOptions(assignment, schema)
						}
					</ReactCSSTransitionGroup>
				</div>
			</StickyContainer>
		);
	}


	renderOptions (assignment, schema) {
		return (
			<div key="options" className="option-container">
				<div className="show-content toggle" onClick={this.showContent}>Done</div>
				<AssignmentOptions assignment={assignment} schema={schema} />
			</div>
		);
	}


	renderContent (assignment, schema) {
		return (
			<div key="content" className="content-container">
				{assignment && (
					<div className="show-options toggle" onClick={this.showOptions}>
						<i className="icon-settings" />
						<span>Options</span>
					</div>
				)}
				<AssignmentContent assignment={assignment} schema={schema} />
				<AssignmentParts assignment={assignment} schema={schema} />
			</div>
		);
	}
}
