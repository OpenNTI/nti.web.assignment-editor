import React from 'react';

export default class Controls extends React.Component {
	static propTypes = {
		value: React.PropTypes.string,
		schema: React.PropTypes.any
	}

	static contextTypes = {
		SelectionManager: React.PropTypes.shape({
			select: React.PropTypes.fn,
			unseleft: React.PropTypes.fn
		})
	}

	constructor (props) {
		super(props);

		this.state = {
			selection: ''
		};

		const bindList = [
			'selectionChanged'
		];

		for (let fn of bindList) {
			this[fn] = this[fn].bind(this);
		}
	}


	componentDidMount () {
		let selectionManager = this.context.SelectionManager;

		selectionManager.addListener('selection-changed', this.selectionChanged);
		this.selectionChanged(selectionManager.getSelection());
	}


	componentWillUnmount () {
	 	let selectionManager = this.context.SelectionManager;

	 	selectionManager.removeListener('selection-changed', this.selectionChanged);
	}


	selectionChanged (selection) {
		this.setState({
			selection: selection.map((item) => item.value).join(', ')
		});
	}


	render () {
		return (
			<span>{this.state.selection}</span>
		);
	}
}
