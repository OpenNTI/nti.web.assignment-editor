import React from 'react';
import HistoryStack from './utils/HistoryStack';

export default class dummy extends React.Component {

	constructor (props) {
		super(props);

		this.stack = new HistoryStack();
		this.state = {value: ''};

		this.onUndo = this.onUndo.bind(this);
		this.onRedo = this.onRedo.bind(this);
		this.onInputChange = this.onInputChange.bind(this);

		this.stack.push(JSON.parse(JSON.stringify(this.state)));
	}


	pushState(state) {
		this.stack.push(JSON.parse(JSON.stringify(state)));
	}


	onUndo () {
		if (this.stack.canUndo) {
			this.state = {};
			this.setState(this.stack.undo());
		}
	}


	onRedo () {
		if (this.stack.canRedo) {
			this.state = {};
			this.setState(this.stack.redo());
		}
	}

	onInputChange (e) {
		this.setState({
			value: e.target.value
		}, () => {
			this.pushState(this.state);
			this.forceUpdate();
		});
	}

	render () {
		let undoColor = this.stack.canUndo ? 'black' : 'grey';
		let redoColor = this.stack.canRedo ? 'black' : 'grey';

		return (
			<div>
				<span style={{color: undoColor}} onClick={this.onUndo}>Undo</span>
				<span style={{color: redoColor}} onClick={this.onRedo}>Redo</span>

				<input type="text" value={this.state.value} onChange={this.onInputChange}/>
			</div>
		);
	}
}
