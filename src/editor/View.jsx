import React from 'react';
import cx from 'classnames';
import {Error, Loading} from 'nti-web-commons';

import ControlBar from '../control-bar';

import FixedElement from './utils/FixedElement';
import AssignmentEditor from './Editor';
import Controls from './controls';
import Sidebar from './sidebar';
import {Manager as SelectionManager} from '../selection';
import {LOADED, ASSIGNMENT_DELETING, ASSIGNMENT_DELETED} from './Constants';
import Store from './Store';
import {loadAssignment} from './Actions';

const selectionManager = new SelectionManager();

export default class Editor extends React.Component {
	static propTypes = {
		NTIID: React.PropTypes.string.isRequired,
		onDeleted: React.PropTypes.func,
		gotoRoot: React.PropTypes.func,
		pageSource: React.PropTypes.object
	}


	static childContextTypes = {
		SelectionManager: React.PropTypes.shape({
			select: React.PropTypes.fn,
			unselect: React.PropTypes.fn
		})
	}

	state = {}

	attachSidebarRef = x => this.sidebar = x


	componentDidMount () {
		Store.addChangeListener(this.onStoreChange);
		loadAssignment(this.props.NTIID);
	}


	componentWillUnmount () {
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
			this.setState({deleting: true});
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
		const {undoQueue} = Store;
		const {gotoRoot, pageSource} = this.props;
		const {deleting} = this.state;
		const {assignment, loadError: error, schema} = Store;

		if (error || (Store.isLoaded && !assignment)) {
			return this.renderError(error || 'No Assignment');
		}

		let cls = cx('assignment-editor-container', {loading: !Store.isLoaded});

		return (
			<div className={cls}>
				{deleting ? (
					<Loading message="Deleting" />
				) : (
					<div className="assignment-editor-container-inner">
						<AssignmentEditor
							assignment={assignment}
							schema={schema}
							gotoRoot={gotoRoot}
							pageSource={pageSource}
						/>
						<div className="assignment-editing-sidebar-column">
							<FixedElement className="assignment-editing-sidebar-fixed">
								<Sidebar ref={this.attachSidebarRef} assignment={assignment} schema={schema} />
							</FixedElement>
						</div>
						<ControlBar visible>
							<Controls assignment={assignment} undoQueue={undoQueue} />
						</ControlBar>
					</div>
				)}
			</div>
		);
	}


	renderError (error) {
		return (
			<div className="assignment-editor error">
				<Error error={error} />
			</div>
		);
	}
}
