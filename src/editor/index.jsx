import React from 'react';

import ControlBar from '../control-bar';
import FixedElement from './utils/FixedElement';
import AssignmentEditor from './assignment-editor';
import Controls from './controls';
import Sidebar from './sidebar';
import SelectionManager from './utils/SelectionManager';
import {LOADED} from './Constants';
import Store from './Store';
import {loadAssignment} from './Actions';
import cx from 'classnames';

const selectionManager = new SelectionManager();

export default class Editor extends React.Component {
	static propTypes = {
		NTIID: React.PropTypes.string.isRequired
	}


	static defaultProps = {
		NTIID: 'tag:nextthought.com,2011-10:NTI-NAQ-assignment_andrew_ligon_4743925595936104722_d30688a3'
	}


	static childContextTypes = {
		SelectionManager: React.PropTypes.shape({
			select: React.PropTypes.fn,
			unseleft: React.PropTypes.fn
		})
	}


	constructor (props) {
		super(props);

		this.state = {
			assignment: null,
			schema: null
		};

		this.onStoreChange = this.onStoreChange.bind(this);
		this.onWindowScroll = this.onWindowScroll.bind(this);
		this.selectionChanged = this.selectionChanged.bind(this);
	}


	componentDidMount () {
		Store.addChangeListener(this.onStoreChange);
		loadAssignment(this.props.NTIID);

		selectionManager.addListener('selection-changed', this.selectionChanged);
		this.selectionChanged(selectionManager.getSelection());
	}


	componenWillUnmount () {
		Store.removeChangeListener(this.onStoreChange);

		selectionManager.removeListener('selection-changed', this.selectionChanged);
	}


	onWindowScroll () {
		const top = window.scrollY;

		if (this.sidebarDOM) {
			this.sidebarDOM.style.transform = `translate3d(0, ${top}px, 0)`;
		}
	}


	onStoreChange (data) {
		if (data.type === LOADED) {
			this.setState({
				assignment: Store.assignment,
				schema: Store.schema
			});
		}
	}


	getChildContext () {
		return {
			SelectionManager: selectionManager
		};
	}


	selectionChanged (selection) {
		this.setState({
			controlBarVisible: selection.length > 0,
			selection: selection.map(x => x.value).join(' ')
		});
	}


	render () {
		let {error, assignment, schema, selection} = this.state;

		if (error) {
			return this.renderError(error);
		}

		let cls = cx('assignment-editor-container', {loading: Store.isLoaded});

		return (
			<div className={cls}>
				<AssignmentEditor assignment={assignment} schema={schema} />
				<FixedElement className="assignment-editing-sidebar-fixed">
					<Sidebar ref={x => this.sidebar = x} assignment={assignment} schema={schema} />
				</FixedElement>
				<ControlBar visible >
					<Controls assignment={assignment} selection={selection} />
				</ControlBar>
			</div>
		);
	}


	renderError (error) {
		return (
			<div className="assignment-editor error">
				<span>{{error}}</span>
			</div>
		);
	}
}
