import React from 'react';
import cx from 'classnames';
import autobind from 'nti-commons/lib/autobind';

import {SelectionItem} from './SelectionManager';

export default class Selectable extends React.Component {
	static propTypes = {
		value: React.PropTypes.any,
		id: React.PropTypes.string,
		className: React.PropTypes.string,
		children: React.PropTypes.any,
		onSelect: React.PropTypes.func,
		onUnselect: React.PropTypes.func
	}

	static contextTypes = {
		SelectionManager: React.PropTypes.shape({
			select: React.PropTypes.func,
			unselect: React.PropTypes.func,
			addListener: React.PropTypes.func,
			removeListener: React.PropTypes.func,
			isSelected: React.PropTypes.func
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

		autobind(this,
			'onSelectionChanged',
			'select',
			'unselect'
		);
	}


	componentWillReceiveProps (nextProps) {
		const prevProps = this.props;
		const item = this.getSelectionItem();

		if (prevProps.id !== nextProps.id) {
			return;
		}

		if (prevProps.value !== nextProps.value) {
			item.value = nextProps.value;
		}
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
		const {selected:wasSelected} = this.state;
		const item = this.getSelectionItem();
		const selectionManager = this.context.SelectionManager;
		const isSelected = selectionManager.isSelected(item);

		if (selectionManager && wasSelected !== isSelected) {
			this.setState({
				selected: isSelected
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
		const {selected} = this.state;
		const {onSelect} = this.props;

		clearTimeout(this.doUnselectTimeout);

		if (selectionManager) {
			selectionManager.select(item);
			e.stopPropagation();
		}

		if (onSelect && !selected) {
			onSelect(item);
		}
	}


	unselect (e) {
		const selectionManager = this.context.SelectionManager;
		const item = this.getSelectionItem();
		const {onUnselect} = this.props;

		e.stopPropagation();

		//Wait to do the unselect actions to see if something is adding focus
		//in the same event cycle. For example: a format button for an editor
		this.doUnselectTimeout = setTimeout(() => {
			if (selectionManager) {
				selectionManager.unselect(item);
			}

			if (onUnselect) {
				onUnselect(item);
			}
		}, 250);
	}


	render () {
		let {className, children, ...otherProps} = this.props;
		let {selected} = this.state;
		let cls = cx(className || '', 'selectable', { selected: selected});

		delete otherProps.onFocus;
		delete otherProps.onBlur;
		delete otherProps.id;
		delete otherProps.value;
		delete otherProps.onSelect;
		delete otherProps.onUnselect;

		return (
			<div {...otherProps} className={cls} onFocus={this.select} onBlur={this.unselect}>
				{children}
			</div>
		);
	}
}
