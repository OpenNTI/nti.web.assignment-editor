import React from 'react';
import ReactDom from 'react-dom';
import FlipMove from 'react-flip-move';
import cx from 'classnames';
import Logger from 'nti-util-logger';
import wait from 'nti-commons/lib/wait';
import autobind from 'nti-commons/lib/autobind';

import Draggable from '../../components/Draggable';
import Dropzone from '../../components/Dropzone';
import MoveInfo from '../../utils/MoveInfo';
import Store from '../../Store';
import {ORDERING_DRAG_OVER, ORDERING_DRAG_LEAVE} from '../../Constants';
import {dragOverOrdering, dragLeaveOrdering} from '../../Actions';

const logger = Logger.get('lib:dnd:ordering:Ordering');


function makeRectRelativeTo (child, parent) {
	let top = child.top - parent.top;
	let left = child.left - parent.left;
	let width = child.width;
	let height = child.height;

	return {
		top: top,
		left: left,
		right: left + width,
		bottom: top + height,
		width: width,
		height: height
	};
}

//For now just check vertically for before and after
//Checking horizontally adds quite a bit of complexity
//and we don't need it just yet
function getMidpointOfRect (rect) {
	return Math.floor(rect.top + (rect.height / 2));
}


function isPointBeforeRect (x, y, rect) {
	const midpoint = getMidpointOfRect(rect);

	return y < midpoint;
}


function isPointAfterRect (x, y, rect) {
	return !isPointBeforeRect(x, y, rect);
}


export default class Ordering extends React.Component {
	static propTypes = {
		containerId: React.PropTypes.string,
		items: React.PropTypes.array.isRequired,
		renderItem: React.PropTypes.func.isRequired,
		renderPlaceholder: React.PropTypes.func,
		handleClassName: React.PropTypes.string,
		accepts: React.PropTypes.array,
		className: React.PropTypes.string,
		onChange: React.PropTypes.func
	}


	constructor (props) {
		super(props);

		let {items} = props;

		this.componentRefs = {};

		autobind(this,
			'renderItem',
			'onContainerDrop',
			'onContainerDragLeave',
			'onContainerDragOver',
			'onStoreChange'
		);

		this.dropHandlers = this.getDropHandlers(this.onContainerDrop.bind(this));

		items = items.slice(0);

		items = items.map(this.mapItem.bind(this));

		this.state = {
			items: items,
			originalOrder: items
		};
	}


	mapItem (item, index) {
		const {containerId} = this.props;
		const moveInfo = new MoveInfo({OriginContainer: containerId, OriginIndex: index});

		return {
			item: item,
			ID: item.NTIID || item.ID,
			MoveData: [item, moveInfo],
			MoveInfo: moveInfo,
			onDragStart: this.onItemDragStart.bind(this, item),
			onDragEnd: this.onItemDragEnd.bind(this, item)
		};
	}


	componentWillReceiveProps (nextProps) {
		const {items:oldItems} = this.state;
		let {items} = nextProps;
		let activeDrag;

		for (let item of oldItems) {
			if (item.isDragging) {
				activeDrag = item;
			}
		}

		items = items.slice(0);

		items = items.map((item, index) => {
			item = this.mapItem(item, index);

			if (activeDrag && activeDrag.ID === item.ID) {
				item.isDragging = true;
			}

			return item;
		});

		this.setState({
			items: items,
			originalOrder: items
		});
	}


	componentDidMount () {
		Store.addChangeListener(this.onStoreChange);
	}


	componentWillUnmount () {
		Store.addChangeListener(this.onStoreChange);
	}


	onStoreChange (e) {
		if (e.type === ORDERING_DRAG_OVER || e.type === ORDERING_DRAG_LEAVE) {
			this.maybeRemovePlaceholder();
		}
	}


	maybeRemovePlaceholder () {
		if (Store.activeOrdering !== this) {
			this.removePlaceholder();
		}
	}


	getPlaceholder () {
		const {containerId} = this.props;
		const {items} = this.state;

		for (let item of items) {
			if (item.isPlaceholder || item.isDragging) {
				item.isPlaceholder = true;
				return item;
			}
		}

		return {
			item: {
				MimeType: 'application/vnd.nextthought.app.placeholder'
			},
			ID: 'Placeholder-' + containerId,
			isPlaceholder: true
		};
	}


	removePlaceholder () {
		let {items} = this.state;
		let hadPlaceholder = false;

		items = items.reduce((acc, item) => {
			hadPlaceholder = item.isPlaceholder || hadPlaceholder;

			if (item.isPlaceholder && item.isDragging) {
				item.isPlaceholder = null;
				acc.push(item);
			} else if (!item.isPlaceholder) {
				acc.push(item);
			}

			return acc;
		}, []);

		if (hadPlaceholder) {
			this.setState({
				items: items,
				disableAnimation: true
			});
		}
	}


	getContainerRect () {
		const container = ReactDom.findDOMNode(this);
		let rect;

		if (container) {
			rect = container.getBoundingClientRect();
		} else {
			rect = {
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				width: 0,
				height: 0
			};
		}

		return rect;
	}


	getRectForId (id) {
		const parentRect = this.getContainerRect();
		const cmp = this.componentRefs[id];
		let rect;

		if (this.lockedRects && this.lockedRects[id]) {
			rect = this.lockedRects[id];
		} else if (cmp && cmp.getBoundingClientRect) {
			rect = makeRectRelativeTo(cmp.getBoundingClientRect(), parentRect);
		} else {
			rect = {
				top: 0,
				height: 0
			};
		}

		return rect;
	}


	getIndexOfPoint (x, y) {
		const parentRect = this.getContainerRect();
		const {items} = this.state;
		let index = 0;

		if (parentRect) {
			x = x - parentRect.left;
			y = y - parentRect.top;
		}

		for (let item of items) {
			let cmpRect = this.getRectForId(item.ID);

			if (item.isPlaceholder || item.isDragging) { continue; }

			if (!cmpRect) {
				logger.error('Now component for item: ', item);
			} else if (isPointAfterRect(x, y, cmpRect)) {
				index += 1;
			} else if (isPointBeforeRect(x, y, cmpRect)) {
				break;
			}
		}

		return index;
	}


	getIndexOfId (id) {
		const {items} = this.state;
		let index = -1;

		for (let i = 0; i < items.length; i++) {
			if (items[i].ID === id) {
				index = i;
				break;
			}
		}

		return index;
	}


	getActiveDragging () {
		const {items} = this.state;

		for (let item of items) {
			if (item.isDragging) {
				return item;
			}
		}
	}


	onContainerDrop (data, dataTransfer, e) {
		const {onChange} = this.props;
		const {clientX, clientY} = e;
		const moveInfo = dataTransfer.findDataFor(MoveInfo.MimeType);
		const dropId = data.NTIID || data.ID;
		let newIndex = this.getIndexOfPoint(clientX, clientY);
		let oldIndex = this.getIndexOfId(dropId);
		let {items} = this.state;

		items = items.slice(0);

		this.lastDroppedId = dropId;

		//If the item dropped is already in the list, and we are dropping it lower.
		//The existing item will push the index down one more than it needs to, so push
		//it back up;
		if (oldIndex >= 0 && newIndex > oldIndex) {
			newIndex -= 1;
		}

		items = items.reduce((acc, item) => {
			if (!item.isPlaceholder && item.ID !== dropId && item.item) {
				acc.push(item.item);
			}

			return acc;
		}, []);

		items = [...items.slice(0, newIndex), data, ...items.slice(newIndex)];

		this.removePlaceholder();
		if (onChange) {
			onChange(items, data, newIndex, new MoveInfo(moveInfo));
		}
	}



	onContainerDragOver (e, canHandle) {
		if (!canHandle) { return; }

		dragOverOrdering(this);

		if (this.isInternalDrag) { return; }

		const {clientX, clientY} = e;
		const placeholder = this.getPlaceholder();
		const index = this.getIndexOfPoint(clientX, clientY);
		const oldIndex = placeholder && this.getIndexOfId(placeholder.ID);
		let {items} = this.state;
		let toInsert = [placeholder];

		//If the placeholder hasn't moved, don't set state
		if (oldIndex === index) { return; }

		items = items.slice(0);

		items = items.filter((item) => {
			return !(item.isPlaceholder || item.isDragging);
		});

		items = [...items.slice(0, index), ...toInsert, ...items.slice(index)];

		this.setState({
			items: items,
			disableAnimation: false
		});
	}


	onContainerDragLeave () {
		dragLeaveOrdering(this);

		this.removePlaceholder();
	}


	onItemDragStart (dragItem) {
		//wait a little bit so the ghost image will be there
		//For html5 drag and drop to work correctly the node that is dragging needs to still be in the dom,
		//since we are using the same node for the placeholder, if it originated from here we need to keep the node
		//and just hide it, if its not we can get rid of it.

		this.lastDroppedId = null;
		this.isInternalDrag = true;

		wait(100)
			.then(() => {
				this.isInternalDrag = null;

				const dragId = dragItem.NTIID || dragItem.ID;
				let {items} = this.state;

				items = items.slice(0);

				this.setState({
					items: items.map((item) => {
						let itemId = item.NTIID || item.ID;

						if (itemId === dragId) {
							item.isDragging = true;
							item.isPlaceholder = true;
						}

						return item;
					}),
					disableAnimation: false
				});
			});
	}


	onItemDragEnd (dragItem) {
		const {onChange} = this.props;
		let {items, originalOrder} = this.state;
		const dragId = dragItem.NTIID || dragItem.ID;
		const wasHandled = Store.wasDataHandled(dragItem);

		items = items.slice(0);

		let itemMap = items.reduce((acc, item) => {
			acc[item.NTIID || item.ID] = item;

			return acc;
		}, {});

		if (!wasHandled || this.lastDroppedId === dragId) {
			items = originalOrder.map((originalItem) => {
				let itemId = originalItem.NTIID || originalItem.ID;
				let item = itemMap[itemId];

				if (itemId === dragId) {
					item.isDragging = false;
					item.isPlaceholder = false;
				}

				return item;
			});

			this.setState({
				items: items,
				disableAnimation: true
			});
		} else {
			items = items.filter((item) => {
				let itemId = item.NTIID || item.ID;

				return itemId !== dragId;
			});

			if (onChange) {
				onChange(items.map(item => item.item));
			}
		}
	}


	getDropHandlers (handler) {
		const {accepts} = this.props;

		return (accepts || []).reduce((acc, accept) => {
			acc[accept] = handler;

			return acc;
		}, {});
	}


	getAttachRef (key) {
		this.attachFns = this.attchFns || {};

		if (!this.attachFns[key]) {
			this.attachFns[key] = (ref) => {
				if (!ref) {
					delete this.attachFns[key];
					delete this.componentRefs[key];
				} else {
					this.componentRefs[key] = ref;
				}
			};
		}

		return this.attachFns[key];
	}



	render () {
		const {className} = this.props;
		const {items, disableAnimation} = this.state;
		const cls = cx('ordering-container', className || '');

		return (
			<Dropzone
				className={cls}
				dropHandlers={this.dropHandlers}
				onDragLeave={this.onContainerDragLeave}
				onDragOver={this.onContainerDragOver}
			>
				<div>
					<FlipMove enterAnimation="fade" leaveAnimation="fade" duration={150} easing="ease-in" disableAllAnimations={disableAnimation}>
						{items.map(this.renderItem)}
					</FlipMove>
				</div>
			</Dropzone>
		);
	}


	renderItem (item, index) {
		const {renderItem, handleClassName} = this.props;
		const cls = cx('ordering-item', {placeholder: item.isPlaceholder, 'is-dragging': item.isDragging});
		const key = item.ID;

		return (
			<Draggable key={key} className={cls} data={item.MoveData} handleClassName={handleClassName} onDragStart={item.onDragStart} onDragEnd={item.onDragEnd}>
				<div ref={this.getAttachRef(key)} data-ordering-key={key}>
					{ !item.isPlaceholder && !item.isDragging ?
						renderItem(item.item, index, item.isPlaceholder) :
						null
					}
				</div>
			</Draggable>
		);
	}
}
