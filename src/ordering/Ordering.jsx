import React from 'react';
import cx from 'classnames';

import Draggable from '../dnd/Draggable';
import Dropzone from '../dnd/Dropzone';
import wait from 'nti-commons/lib/wait';


function insertPlaceholderByItem (items, id, placeholder, before) {
	return items.reduce((acc, item) => {
		//Don't add the placeholder in the current position
		if (item.isPlaceholder) { return acc; }

		if (item.ID === id) {
			acc.push(before ? placeholder : item);
			acc.push(before ? item : placeholder);
		} else {
			acc.push(item);
		}

		return acc;
	}, []);
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
		this.onItemDrop = this.onItemDrop.bind(this);

		items = items.slice(0);

		items = items.map((item) => {
			return {
				item: item,
				ID: item.NTIID || item.ID,
				onDragStart: this.onItemDragStart.bind(this, item),
				onDragEnd: this.onItemDragEnd.bind(this, item),
				onDragOver: this.onItemDragOver.bind(this, item)
			};
		});

		this.state = {
			items: items,
			originalOrder: items
		};
	}


	getOrCreatePlaceholder () {
		let {items} = this.state;

		for (let item of items) {
			if (item.isPlaceholder) {
				return item;
			}
		}

		//TODO: generate a placeholder
	}


	movePlaceholderBefore (id) {
		let {items} = this.state;
		let placeholder = this.getOrCreatePlaceholder();

		if (!placeholder) { return; }

		placeholder.hide = false;

		items = insertPlaceholderByItem(items, id, placeholder, true);

		this.setState({
			items: items
		});
	}


	movePlaceholderAfter (id) {
		let {items} = this.state;
		let placeholder = this.getOrCreatePlaceholder();

		if (!placeholder) { return; }

		placeholder.hide = false;

		items = insertPlaceholderByItem(items, id, placeholder, false);

		this.setState({
			items: items
		});
	}


	onContainerDrop () {
		// debugger;
	}


	onContainerDragLeave () {
		let {items} = this.state;

		//For html5 drag and drop to work correctly the node that is dragging needs to still be in the dom,
		//since we are using the same node for the placeholder, if it originated from here we need to keep the node
		//and just hide it, if its not we can get rid of it.
		items = items.reduce((acc, item) => {
			if (item.isPlaceholder && !item.isExternalPlaceholder) {
				item.hide = true;
				acc.push(item);
			} else if (!item.isPlaceholder) {
				acc.push(item);
			}

			return acc;
		}, []);

		this.setState({
			items: items
		});
	}


	onItemDrop () {
		// debugger;
	}


	onItemDragStart (dragItem) {
		//wait a little bit so the ghost image will be there
		wait(100)
			.then(() => {
				const dragId = dragItem.NTIID || dragItem.ID;
				let {items} = this.state;

				items = items.slice(0);

				this.setState({
					items: items.map((item) => {
						let itemId = item.NTIID || item.ID;

						if (itemId === dragId) {
							item.item.isPlaceholder = true;
							item.isPlaceholder = true;
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

				if (item.isPlaceholder && itemId === dragId) {
					item.item.isPlaceholder = false;
					item.isPlaceholder = false;
				}

				return item;
			});
		} else {
			items = items.filter((item) => {
				let itemId = item.NTIID || item.ID;

				return !item.isPlaceholder || itemId !== dragId;
			});
		}

		this.setState({
			items: items
		});
	}


	onItemDragOver (item, e) {
		if (item.isPlaceholder) {
			return;
		}

		const dragOverId = item.NTIID || item.ID;
		const dragOverRef = this.componentRefs[dragOverId];
		const dragOverRect = dragOverRef && dragOverRef.getBoundingClientRect();
		const midPoint = dragOverRect && (dragOverRect.top + (dragOverRect.height / 2));
		const clientY = e.clientY;

		if (!dragOverRef) { return; }

		if (clientY < midPoint) {
			this.movePlaceholderBefore(dragOverId);
		} else {
			this.movePlaceholderAfter(dragOverId);
		}
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
			<Dropzone className={cls} dropHandlers={this.getDropHandlers(this.onContainerDrop)} onDragLeave={this.onContainerDragLeave}>
				<ul>
					<li className="spacer"></li>
					{items.map(this.renderItem)}
					<li className="spacer"></li>
				</ul>
			</Dropzone>
		);
	}


	renderItem (item, index) {
		const {renderItem, handleClassName} = this.props;
		const cls = cx('ordering-item', {placeholder: item.isPlaceholder, hide: item.hide});


		return (
			<Dropzone className={cls} key={item.ID} onDragOver={item.onDragOver}>
				<Draggable data={item.item} handleClassName={handleClassName} onDragStart={item.onDragStart} onDragEnd={item.onDragEnd}>
					<li ref={x => this.componentRefs[item.ID] = x}>
						{ !item.isPlaceholder ?
							renderItem(item.item, index, item.isPlaceholder) :
							null
						}
					</li>
				</Draggable>
			</Dropzone>
		);
	}
}
