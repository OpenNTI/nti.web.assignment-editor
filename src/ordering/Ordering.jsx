import React from 'react';
import ReactDom from 'react-dom';
import cx from 'classnames';
import Logger from 'nti-util-logger';

import Draggable from '../dnd/Draggable';
import Dropzone from '../dnd/Dropzone';
import wait from 'nti-commons/lib/wait';

const logger = Logger.get('ordering');


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
		items: React.PropTypes.array.isRequired,
		renderItem: React.PropTypes.func.isRequired,
		renderPlaceholder: React.PropTypes.func,
		handleClassName: React.PropTypes.string,
		accepts: React.PropTypes.array,
		className: React.PropTypes.string
	}


	constructor (props) {
		super(props);

		let {items} = props;

		this.componentRefs = {};

		this.renderItem = this.renderItem.bind(this);
		this.onContainerDrop = this.onContainerDrop.bind(this);
		this.onContainerDragLeave = this.onContainerDragLeave.bind(this);
		this.onContainerDragOver = this.onContainerDragOver.bind(this);

		this.dropHandlers = this.getDropHandlers(this.onContainerDrop.bind(this));

		items = items.slice(0);

		items = items.map((item) => {
			return {
				item: item,
				ID: item.NTIID || item.ID,
				onDragStart: this.onItemDragStart.bind(this, item),
				onDragEnd: this.onItemDragEnd.bind(this, item)
			};
		});

		this.state = {
			items: items,
			originalOrder: items
		};
	}


	getPlaceholder () {
		const {items} = this.state;

		for (let item of items) {
			if (item.isPlaceholder) {
				return item;
			}
		}

		return {
			item: {
				MimeType: 'application/vnd.nextthought.app.placeholder'
			},
			ID: 'Placeholder',
			isPlaceholder: true
		};
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

			if (item.isPlaceholder) { continue; }

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


	lockRects () {
		if (this.lockedRects) {
			return;
		}

		const {componentRefs} = this;
		const {items} = this.state;
		const parentRect = this.getContainerRect();

		if (parentRect) {
			this.lockedRects = items.reduce((acc, item) => {
				let cmp = componentRefs[item.ID];

				if (cmp && !item.isPlaceholder) {
					acc[item.ID] = makeRectRelativeTo(cmp.getBoundingClientRect(), parentRect);
				}

				return acc;
			}, {});
		}
	}


	unlockRects () {
		this.lockedRects = null;
	}


	onContainerDrop () {
		// debugger;
	}


	onContainerDragOver (e) {
		this.lockRects();

		const {clientX, clientY} = e;
		const placeholder = this.getPlaceholder();
		const index = this.getIndexOfPoint(clientX, clientY);
		let {items} = this.state;

		items = items.filter((item) => {
			return !item.isPlaceholder;
		});

		items = [...items.slice(0, index), placeholder, ...items.slice(index)];

		this.setState({
			items: items
		});
	}


	onContainerDragLeave () {
		this.unlockRects();

		let {items} = this.state;

		items = items.reduce((acc, item) => {
			if (!item.isPlaceholder) {
				acc.push(item);
			}

			return acc;
		}, []);

		this.setState({
			items: items
		});
	}

	onItemDragStart (dragItem) {
		//wait a little bit so the ghost image will be there
		//For html5 drag and drop to work correctly the node that is dragging needs to still be in the dom,
		//since we are using the same node for the placeholder, if it originated from here we need to keep the node
		//and just hide it, if its not we can get rid of it.
		wait(100)
			.then(() => {
				const dragId = dragItem.NTIID || dragItem.ID;
				let {items} = this.state;

				items = items.slice(0);

				this.setState({
					items: items.map((item) => {
						let itemId = item.NTIID || item.ID;

						if (itemId === dragId) {
							item.isDragging = true;
						}

						return item;
					})
				});
			});
	}


	onItemDragEnd (dragItem, e) {
		let {items, originalOrder} = this.state;
		const dragId = dragItem.NTIID || dragItem.ID;
		const {dataTransfer} = e;
		const wasHandled = dataTransfer.dropEffect !== 'none';

		if (!wasHandled) {
			items = originalOrder.map((item) => {
				let itemId = item.NTIID || item.ID;

				if (itemId === dragId) {
					item.isDragging = false;
				}

				return item;
			});
		} else {
			items = items.filter((item) => {
				let itemId = item.NTIID || item.ID;

				return !item.isDragging || itemId !== dragId;
			});
		}

		this.setState({
			items: items
		});
	}


	getDropHandlers (handler) {
		const {accepts} = this.props;

		return (accepts || []).reduce((acc, accept) => {
			acc[accept] = handler;

			return acc;
		}, {});
	}



	render () {
		const {className} = this.props;
		const {items} = this.state;
		const cls = cx('ordering-container', className || '');

		return (
			<Dropzone className={cls} dropHandlers={this.dropHandlers} onDragLeave={this.onContainerDragLeave} onDragOver={this.onContainerDragOver}>
				<ul>
					{items.map(this.renderItem)}
				</ul>
			</Dropzone>
		);
	}


	renderItem (item, index) {
		const {renderItem, handleClassName} = this.props;
		const cls = cx('ordering-item', {placeholder: item.isPlaceholder, 'is-dragging': item.isDragging});


		return (
			<Draggable key={item.ID} className={cls} data={item.item} handleClassName={handleClassName} onDragStart={item.onDragStart} onDragEnd={item.onDragEnd}>
				<li ref={x => this.componentRefs[item.ID] = x}>
					{ !item.isPlaceholder && !item.isDragging ?
						renderItem(item.item, index, item.isPlaceholder) :
						null
					}
				</li>
			</Draggable>
		);
	}
}
