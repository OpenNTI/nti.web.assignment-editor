import React from 'react';
import ReactDOM from 'react-dom';

import AssignmentEditor from './assignment-editor';
import Controls from './controls';
import Sidebar from './sidebar';
import SelectionManager from './utils/SelectionManager';
import MoveRoot from './utils/MoveRoot';
import {LOADED} from './Constants';
import Store from './Store';
import {loadAssignment} from './Actions';
import cx from 'classnames';

const selectionManager = new SelectionManager();

export default class Editor extends React.Component {
	static propTypes = {
		NTIID: React.PropTypes.string.isRequired,
		moveLink: React.PropTypes.string.isRequired
	}


	static defaultProps = {
		NTIID: 'tag:nextthought.com,2011-10:NTI-NAQ-assignment_andrew_ligon_4743925595936104722_d30688a3',
		moveLink: '/dataserver2/%2B%2Betc%2B%2Bhostsites/platform.ou.edu/%2B%2Betc%2B%2Bsite/Courses/Summer2015/NTI-1000/@@AssessmentMove'
	}


	static childContextTypes = {
		SelectionManager: React.PropTypes.shape({
			select: React.PropTypes.fn,
			unseleft: React.PropTypes.fn
		}),
		MoveRoot: React.PropTypes.shape({
			moveRecordFrom: React.PropTypes.func
		})
	}


	constructor (props) {
		super(props);

		this.state = {
			sidebarTransform: 'none'
		};

		this.onStoreChange = this.onStoreChange.bind(this);
		this.onWindowScroll = this.onWindowScroll.bind(this);
	}


	componentDidMount () {
		Store.addChangeListener(this.onStoreChange);
		loadAssignment(this.props.NTIID);

		this.sidebarDOM = ReactDOM.findDOMNode(this.sidebar);

		// window.addEventListener('scroll', this.onWindowScroll);
	}


	componenWillUnmount () {
		Store.removeChangeListener(this.onStoreChange);

		// window.removeEventListener('scroll', this.onWindowScroll);
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
		const {moveLink} = this.props;

		return {
			SelectionManager: selectionManager,
			MoveRoot: new MoveRoot(moveLink)
		};
	}


	render () {
		let {error, assignment, schema} = this.state;

		if (error) {
			return this.renderError(error);
		}

		let cls = cx('assignment-editor-container', {loading: Store.isLoaded});

		return (
			<div className={cls}>
				<AssignmentEditor assignment={assignment} schema={schema} />
				<Sidebar ref={x => this.sidebar = x} assignment={assignment} schema={schema} />
				<Controls />
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
