import React from 'react';

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
		NTIID: 'tag:nextthought.com,2011-10:NTI-NAQ-assignment_andrew_ligon_4743924853241199962_21650fae'
	}


	static childContextTypes = {
		SelectionManager: React.PropTypes.shape({
			select: React.PropTypes.fn,
			unseleft: React.PropTypes.fn
		})
	}


	constructor (props) {
		super(props);

		this.state = {};

		this.onStoreChange = this.onStoreChange.bind(this);
	}


	componentDidMount () {
		Store.addChangeListener(this.onStoreChange);
		loadAssignment(this.props.NTIID);
	}


	componenWillUnmount () {
		Store.removeChangeListener(this.onStoreChange);
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


	render () {
		let {error, assignment, schema} = this.state;

		if (error) {
			return this.renderError(error);
		}

		let cls = cx('assignment-editor', {loading: Store.isLoaded});

		return (
			<div className={cls}>
				<AssignmentEditor assignment={assignment} schema={schema}/>
				<Sidebar assignment={assignment} schema={schema}/>
				<Controls/>
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
