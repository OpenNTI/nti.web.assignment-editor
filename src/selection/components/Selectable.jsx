import './Selectable.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import SelectionItem from '../SelectionItem';

export default class Selectable extends React.Component {
	static propTypes = {
		value: PropTypes.any,
		id: PropTypes.string,
		className: PropTypes.string,
		children: PropTypes.any,
		onSelect: PropTypes.func,
		onUnselect: PropTypes.func,
		onChildSelect: PropTypes.func,
		onChildUnselect: PropTypes.func,
	};

	static childContextTypes = {
		SelectionParent: PropTypes.shape({
			childSelected: PropTypes.func,
			childUnselected: PropTypes.func,
		}),
	};

	static contextTypes = {
		SelectionManager: PropTypes.shape({
			select: PropTypes.func,
			unselect: PropTypes.func,
			addListener: PropTypes.func,
			removeListener: PropTypes.func,
			isSelected: PropTypes.func,
		}),
		SelectionParent: PropTypes.shape({
			childSelected: PropTypes.func,
			childUnselected: PropTypes.func,
		}),
	};

	static defaultProps = {
		onSelect: () => {},
		onUnselect: () => {},
	};

	selectedChildren = [];

	constructor(props) {
		super(props);

		this.state = {
			selected: false,
		};
	}

	getChildContext() {
		return {
			SelectionParent: this,
		};
	}

	componentDidUpdate(prevProps) {
		const nextProps = this.props;
		const item = this.getSelectionItem();

		if (prevProps.id !== nextProps.id) {
			return;
		}

		if (prevProps.value !== nextProps.value) {
			item.value = nextProps.value;
		}
	}

	componentDidMount() {
		let selectionManager = this.context.SelectionManager;

		if (selectionManager) {
			selectionManager.addListener(
				'selection-changed',
				this.onSelectionChanged
			);
		}

		this.onSelectionChanged();
	}

	componentWillUnmount() {
		let selectionManager = this.context.SelectionManager;

		if (selectionManager) {
			selectionManager.removeListener(
				'selection-changed',
				this.onSelectionChanged
			);
		}
	}

	onSelectionChanged = () => {
		const { selected: wasSelected } = this.state;
		const item = this.getSelectionItem();
		const selectionManager = this.context.SelectionManager;
		const isSelected = selectionManager.isSelected(item);

		if (selectionManager && wasSelected !== isSelected) {
			this.setState({
				selected: isSelected,
			});
		}
	};

	getSelectionItem() {
		if (!this.selectionItem) {
			this.selectionItem = new SelectionItem({
				id: this.props.id,
				value: this.props.value,
			});
		}

		return this.selectionItem;
	}

	select = e => {
		const {
			SelectionManager: selectionManager,
			SelectionParent: selectionParent,
		} = this.context;
		const item = this.getSelectionItem();
		const { selected } = this.state;
		const { onSelect, id } = this.props;

		clearTimeout(this.doUnselectTimeout);

		if (selectionManager) {
			selectionManager.select(item);
			e.stopPropagation();

			if (selectionParent) {
				selectionParent.childSelected(id);
			}
		}

		if (onSelect && !selected) {
			onSelect(item);
		}
	};

	unselect = e => {
		e.stopPropagation();

		//Wait to do the unselect actions to see if something is adding focus
		//in the same event cycle. For example: a format button for an editor
		this.doUnselectTimeout = setTimeout(() => {
			this.doUnselect();
		}, 250);
	};

	doUnselect() {
		const {
			SelectionManager: selectionManager,
			SelectionParent: selectionParent,
		} = this.context;
		const item = this.getSelectionItem();
		const { onUnselect, id } = this.props;

		if (selectionManager) {
			selectionManager.unselect(item);

			if (selectionParent) {
				selectionParent.childUnselected(id);
			}
		}

		if (onUnselect) {
			onUnselect(item);
		}
	}

	childSelected(id) {
		const { onChildSelect } = this.props;
		const isSelected = this.selectedChildren.find(x => x === id);

		if (!isSelected) {
			this.selectedChildren.push(id);
		}

		clearTimeout(this.doUnselectChildTimeout);

		//On select should always set the state to having a child selected
		this.setState(
			{
				childSelected: true,
			},
			() => {
				if (onChildSelect) {
					onChildSelect();
				}
			}
		);
	}

	childUnselected(id) {
		const { onChildUnselect } = this.props;

		this.selectedChildren = this.selectedChildren.filter(x => x !== id);

		//Wait to do the unselect actions to see if something is adding focus
		//in the same event cycle.
		this.doUnselectChildTimeout = setTimeout(() => {
			//Unselected should only set the state to unselected if there
			//are no other selected children
			this.setState(
				{
					childSelected: this.selectedChildren.length,
				},
				() => {
					if (onChildUnselect) {
						onChildUnselect();
					}
				}
			);
		}, 250);
	}

	render() {
		let { className, children, ...otherProps } = this.props;
		let { selected, childSelected } = this.state;
		let cls = cx(className || '', 'selectable', {
			selected,
			childSelected,
		});

		delete otherProps.onFocus;
		delete otherProps.onBlur;
		delete otherProps.id;
		delete otherProps.value;
		delete otherProps.onSelect;
		delete otherProps.onUnselect;
		delete otherProps.onChildSelect;
		delete otherProps.onChildUnselect;

		return (
			<div
				{...otherProps}
				className={cls}
				onFocus={this.select}
				onBlur={this.unselect}
			>
				{children}
			</div>
		);
	}
}
