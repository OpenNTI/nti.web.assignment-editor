import React from 'react';
import cx from 'classnames';
import autobind from 'nti-commons/lib/autobind';
import {Error, Loading} from 'nti-web-commons';

import ControlBar from '../control-bar';

import FixedElement from './utils/FixedElement';
import AssignmentEditor from './assignment-editor';
import Controls from './controls';
import Sidebar from './sidebar';
import SelectionManager from './utils/SelectionManager';
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


	static defaultProps = {
		NTIID: 'tag:nextthought.com,2011-10:NTI-NAQ-assignment_andrew_ligon_4743925595936104722_d30688a3'
	}


	static childContextTypes = {
		SelectionManager: React.PropTypes.shape({
			select: React.PropTypes.fn,
			unselect: React.PropTypes.fn
		})
	}


	constructor (props) {
		super(props);

		this.state = {
			assignment: null,
			schema: null
		};

		autobind(this,
			'onStoreChange',
			'onWindowScroll'
		);
	}


	attachSidebarRef = x => this.sidebar = x


	componentDidMount () {
		Store.addChangeListener(this.onStoreChange);
		loadAssignment(this.props.NTIID);
	}


	componenWillUnmount () {
		Store.removeChangeListener(this.onStoreChange);
	}


	onWindowScroll () {
		const top = window.scrollY;

		if (this.sidebarDOM) {
			this.sidebarDOM.style.transform = `translate3d(0, ${top}px, 0)`;
		}
	}


	onStoreChange (data) {
		const {onDeleted} = this.props;

		if (data.type === LOADED) {
			this.setState({
				assignment: Store.assignment,
				schema: Store.schema
			});
		} else if (data.type === ASSIGNMENT_DELETING) {
			this.setState({
				deleting: true
			});
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
		let {error, assignment, schema, deleting} = this.state;

		if (error || (Store.isLoaded && !assignment)) {
			return this.renderError(error || 'No Assignment');
		}

		let cls = cx('assignment-editor-container', {loading: Store.isLoaded});

		return (
			<div className={cls}>
				{!assignment ? (
					<Loading/>
				) : deleting ? (
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
