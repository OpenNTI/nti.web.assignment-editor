import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {Error, Loading, ControlBar} from '@nti/web-commons';
import {PropType as NTIID} from '@nti/lib-ntiids';

import {Manager as SelectionManager} from '../selection';

import FixedElement from './utils/FixedElement';
import AssignmentEditor from './Editor';
import Controls from './controls';
import Sidebar from './sidebar';
import {LOADED, ASSIGNMENT_DELETING, ASSIGNMENT_DELETED} from './Constants';
import Store from './Store';
import {loadAssignmentWithCourse, freeAssignment} from './Actions';
import NotFound from './NotFound';
import * as ConflictResolution from './conflict-resolution';

const selectionManager = new SelectionManager();

export default class Editor extends React.Component {
	static propTypes = {
		assignmentId: PropTypes.string.isRequired,
		courseId: NTIID.isRequired,
		onDeleted: PropTypes.func,
		gotoRoot: PropTypes.func,
		previewAssignment: PropTypes.func,
		pageSource: PropTypes.object
	}


	static childContextTypes = {
		SelectionManager: PropTypes.shape({
			select: PropTypes.func,
			unselect: PropTypes.func
		})
	}

	state = {}

	attachSidebarRef = x => this.sidebar = x


	componentDidMount () {
		const {assignmentId, courseId} = this.props;

		ConflictResolution.register();
		Store.addChangeListener(this.onStoreChange);
		loadAssignmentWithCourse(assignmentId, courseId);
	}


	componentWillUnmount () {
		freeAssignment(Store.assignment);
		ConflictResolution.unregister();
		Store.removeChangeListener(this.onStoreChange);
	}


	onWindowScroll = () => {
		const top = window.scrollY;

		if (this.sidebarDOM) {
			this.sidebarDOM.style.transform = `translate3d(0, ${top}px, 0)`;
		}
	}


	onStoreChange = (data) => {
		const {onDeleted} = this.props;

		if (data.type === LOADED) {
			this.forceUpdate();
		} else if (data.type === ASSIGNMENT_DELETING) {
			this.setState({ deleting: Store.isDeleting });
		} else if (data.type === ASSIGNMENT_DELETED) {
			if (onDeleted) {
				onDeleted();
			}
		}
	}


	getChildContext () {
		return {
			SelectionManager: selectionManager
		};
	}


	render () {
		const {undoStack} = Store;
		const {gotoRoot, pageSource, previewAssignment} = this.props;
		const {deleting} = this.state;
		const {assignment, course, loadError: error, schema} = Store;
		const readOnly = assignment && !assignment.getLink('edit');

		if ((Store.isLoaded && !assignment) || (error && error.statusCode === 404)) {
			return this.renderFailedToLoad();
		}

		if (error) {
			return this.renderError(error || 'No Assignment');
		}

		let cls = cx('assignment-editor-container', {loading: !Store.isLoaded});

		return (
			<div className={cls}>
				{deleting ? (
					<Loading.Mask message="Deleting" />
				) : (
					<div className="assignment-editor-container-inner">
						<AssignmentEditor
							assignment={assignment}
							course={course}
							schema={schema}
							gotoRoot={gotoRoot}
							pageSource={pageSource}
							previewAssignment={previewAssignment}
						/>
						<div className="assignment-editing-sidebar-column">
							<FixedElement className="assignment-editing-sidebar-fixed">
								<Sidebar ref={this.attachSidebarRef} assignment={assignment} schema={schema} readOnly={readOnly} />
							</FixedElement>
						</div>
						<ControlBar visible>
							<Controls assignment={assignment} undoStack={undoStack} previewAssignment={previewAssignment} selectionManager={selectionManager} />
						</ControlBar>
					</div>
				)}
			</div>
		);
	}


	renderError (error) {
		return (
			<div className="assignment-editor-container error">
				<Error error={error} />
			</div>
		);
	}


	renderFailedToLoad () {
		const {gotoRoot} = this.props;

		return (
			<NotFound gotoRoot={gotoRoot} />
		);
	}
}
