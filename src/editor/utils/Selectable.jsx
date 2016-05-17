import React from 'react';
import cx from 'classnames';

import {SelectionItem} from './SelectionManager';

export default class Selectable extends React.Component {
	static propTypes = {
		value: React.PropTypes.string,
		id: React.PropTypes.string,
		className: React.PropTypes.string,
		children: React.PropTypes.any,
		onSelect: React.PropTypes.fn,
		onUnselect: React.PropTypes.fn
	}

	static contextTypes = {
		SelectionManager: React.PropTypes.shape({
			select: React.PropTypes.fn,
			unselect: React.PropTypes.fn,
			addListener: React.PropTypes.fn,
			removeListener: React.PropTypes.fn,
			isSelected: React.PropTypes.fn
		})
	}

	static defaultProps = {
		onSelect: () => {},
		onUnselect: () => {}
	}

	constructor (props) {
		super(props);

		this.state = {
			selected: false
		};

		const bindList = [
			'onSelectionChanged',
			'select',
			'unselect'
		];

		for (let fn of bindList) {
			this[fn] = this[fn].bind(this);
		}
	}


	componentWillReceiveProps (/*nextProps*/) {
		//TODO: when receiving new props update the value of the selection item, and warn if the id changes
	}


	componentDidMount () {
		let selectionManager = this.context.SelectionManager;

		if (selectionManager) {
			selectionManager.addListener('selection-changed', this.onSelectionChanged);
		}

		this.onSelectionChanged();
	}


	componentWillUnmount () {
		let selectionManager = this.context.SelectionManager;

		if (selectionManager) {
			selectionManager.removeListener('selection-changed', this.onSelectionChanged);
		}
	}


	onSelectionChanged () {
		let item = this.getSelectionItem();
		let selectionManager = this.context.SelectionManager;

		if (selectionManager) {
			this.setState({
				selected: selectionManager.isSelected(item)
			});
		}
	}


	getSelectionItem () {
		if (!this.selectionItem) {
			this.selectionItem = new SelectionItem({
				id: this.props.id,
				value: this.props.value
			});
		}

		return this.selectionItem;
	}


	select (e) {
		const selectionManager = this.context.SelectionManager;
		const item = this.getSelectionItem();
		const {onSelect} = this.props;

		if (selectionManager) {
			selectionManager.select(item);
			e.stopPropagation();
		}

		if (onSelect) {
			onSelect(item);
		}
	}


	unselect (e) {
		const selectionManager = this.context.SelectionManager;
		const item = this.getSelectionItem();
		const {onUnselect} = this.props;

		if (selectionManager) {
			selectionManager.unselect(item);
			e.stopPropagation();
		}

		if (onUnselect) {
			onUnselect(item);
		}
	}


	render () {
		let {className, children} = this.props;
		let {selected} = this.state;
		let cls = cx(className || '', 'selectable', { selected: selected});

		return (
			<div className={cls} onFocus={this.select} onBlur={this.unselect}>
				{children}
			</div>
		);
	}
}
