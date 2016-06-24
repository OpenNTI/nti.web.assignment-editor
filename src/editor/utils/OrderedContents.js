import {getService} from  'nti-web-client';
import uuid from 'node-uuid';
import path from 'path';
import minWait, {SHORT} from 'nti-commons/lib/wait-min';

const LINK_NAME = 'ordered-contents';

const FIELDS = [
	'questions',
	'parts'
];


function getLinkFromObj (obj) {
	return obj && (obj.getOrderedContentsLink ? obj.getOrderedContentsLink() : obj.getLink(LINK_NAME));
}


export function hasOrderedContents (obj) {
	const link = getLinkFromObj(obj);

	return !!link;
}


export default class OrderedContents {
	constructor (obj) {
		this.backingObject = obj;
	}


	get orderedContentsField () {
		const obj = this.backingObject;

		if (obj.orderedContentsField) {
			return obj.orderedContentsField;
		}

		for (let field of FIELDS) {
			if (Array.isArray(obj[field])) {
				return field;
			}
		}
	}


	get orderedContents () {
		const {orderedContentsField} = this;

		if (!orderedContentsField) {
			return [];
		}

		return this.backingObject[orderedContentsField];
	}


	get length () {
		return this.orderedContents.length;
	}


	get link () {
		return getLinkFromObj(this.backingObject);
	}


	get canEdit () {
		return hasOrderedContents(this.backingObject);
	}


	isSameContainer (record) {
		const myId = this.backingObject.NTIID;
		const theirId = record.NTIID ? record.NTIID : record;

		return myId === theirId;
	}


	indexOf (item) {
		let {orderedContents} = this;
		let NTIID = item.NTIID ? item.NTIID : item;

		for (let i = 0; i < orderedContents.length; i++) {
			if (orderedContents[i] && orderedContents[i].NTIID === NTIID) {
				return i;
			}
		}

		return -1;
	}


	findItem (item) {
		let {orderedContents} = this;
		let NTIID = item.NTIID ? item.NTIID : item;

		for (let i = 0; i < orderedContents.length; i++) {
			if (orderedContents[i].NTIID === NTIID) {
				return orderedContents[i];
			}
		}

		return null;
	}

	/**
	 * Given an item and an index, insert it at the right place and try to save it to the server.
	 * If it's successful, replace the optimistic placeholder with the item from the server.
	 * If it fails, add an error to the optimistic placeholder and trigger a change
	 * @param  {Object} item the item to append
	 * @param {Number} index the index to insert the item at
	 * @return {Promise}      fulfills or rejects if the item is successfully added or not
	 */
	insertAt (item, index) {
		const obj = this.backingObject;
		let {orderedContents, orderedContentsField, link} = this;

		if (!link) {
			return Promise.reject('No Ordered Contents Link');
		}

		//Go ahead and optimistically add the item with an isSaving flag
		Object.defineProperty(item, 'isSaving', {
			enumerable: false,
			value: true
		});

		//Make sure it has a unique id on it
		if (!item.NTIID) {
			Object.defineProperty(item, 'NTIID', {
				enumerable: false,
				value: uuid.v4()
			});
		}

		if (index === Infinity || index === undefined) {
			index = orderedContents.length;
		}
		if (index < 0) {
			index = 0;
		}

		orderedContents = [...orderedContents.slice(0, index), item, ...orderedContents.slice(index)];

		obj[orderedContentsField] = orderedContents;
		obj.onChange();

		let insertLink = path.join(link, 'index', index.toString(10));

		return getService()
			.then(service =>
				service.postParseResponse(insertLink, item)
			)
			//Make sure we wait at least a little bit
			.then(minWait(SHORT))
			.then((savedItem) => {
				//after it has saved, replace the optimistic placeholder with the real thing
				orderedContents[index] = savedItem;
				obj[orderedContentsField] = orderedContents;
				obj.onChange();
			})
			.catch((reason) => {
				delete item.isSaving;

				//if there is an error, replace the optimistic placeholder with an error case
				item.defineProperty(item, 'isNotSaved', {
					enumerable: false,
					value: true
				});

				item.defineProperty(item, 'error', {
					enumerable: false,
					value: reason
				});


				//Fire the on change
				obj.onChange();

				return Promise.reject(reason);
			});
	}

	/**
	 * Given an item optimistically add it to the items, and try to save it to the server.
	 * If it's successful, replace the optimistic placeholder with the item from the server.
	 * If it fails, add an error to the optimistic placeholder and trigger a change
	 * @param  {Object} item the item to append
	 * @return {Promise}      fulfills or rejects if the item is successfully added or not
	 */
	append (item) {
		return this.insertAt(item, Infinity);
	}


	/**
	 * Given an item, if its in the ordered contents mark it for deletion, and try to delete it from the server.
	 * If it's successful, remove the item from the ordered contents.
	 * If it fails, add an error to the existing item and leave it there.
	 *
	 * If the item isn't in the ordered contents there's nothing to do so just resolve
	 *
	 * @param  {Object} item the item to delete
	 * @return {Promise}     fulfills or rejects if the item is successfully deleted or not
	 */
	remove (item) {
		const obj = this.backingObject;
		let {orderedContents, orderedContentsField, link} = this;
		let index = this.indexOf(item);

		if (!link) {
			return Promise.reject('No Ordered Contents Link');
		}

		//If the item isn't in the ordered contents there's nothing to do
		if (index < 0) {
			return Promise.resolve();
		}

		item = orderedContents[index];

		//Mark Item as deleting
		Object.defineProperty(item, 'isDeleting', {
			enumerable: false,
			value: true
		});

		obj[orderedContentsField] = orderedContents;
		obj.onChange();

		let deleteRequest;

		if (!item.NTIID) {
			deleteRequest = Promise.reject('No NTIID on the item to delete');
		} else {
			let deleteLink = path.join(link, 'ntiid', item.NTIID);

			deleteRequest = getService()
								.then((service) => {
									return service.delete(deleteLink);
								});
		}

		return deleteRequest
				.then(minWait(SHORT))
				.then(() => {
					//After its removed from the server, remove it from the ordered contents
					orderedContents = orderedContents.filter(a => a.NTIID !== item.NTIID);
					obj[orderedContentsField] = orderedContents;
					obj.onChange();
				})
				.catch((reason) => {
					delete item.isDeleting;

					//If the server fails, leave it in the ordered contents and mark it with an error
					item.defineProperty(item, 'isNotDeleted', {
						enumerable: false,
						value: true
					});


					item.defineProperty(item, 'error', {
						enumerable: false,
						value: reason
					});

					obj.onChange();

					return Promise.reject(reason);
				});

	}


	/**
	 * Given an item, try to move it to the given index
	 *
	 * If the item is already in the list, optimistically move it to the new spot and mark it as saving
	 * If the item is not already in the list, optimistically add it to the new sport and mark it as saving
	 *
	 * If there is an error saving, either move it back to the old index or remove it, and mark it with an error
	 *
	 * @param  {Object|String} item    the record or NTIID to move
	 * @param  {Number} newIndex     the index to move to
	 * @param  {Number} oldIndex  the original index
	 * @param  {Object|String} oldParent the original parent
	 * @param  {Object} moveRoot  the root to move items between
	 * @return {Promise}           fulfills or rejects if the move was successful
	 */
	move (item, newIndex, oldIndex, oldParent, moveRoot) {
		const obj = this.backingObject;
		let {orderedContents, orderedContentsField} = this;
		let currentIndex = this.indexOf(item);

		if (!moveRoot) {
			return Promise.reject('No moving root provided');
		}

		//If its in the same position in the same container there is nothing to do
		if (newIndex === currentIndex && this.isSameContainer(oldParent)) {
			return Promise.resolve();
		}

		if (currentIndex === -1 || !oldIndex) {
			return this.insertAt(item, newIndex);
		}

		orderedContents = orderedContents.slice(0);

		if (currentIndex >= 0) {
			item = orderedContents[currentIndex];
			orderedContents.splice(currentIndex, 1);
		}

		//Mark the Item as saving
		Object.defineProperty(item, 'isSaving', {
			enumerable: false,
			value: true
		});

		//Optimistically insert the record at the new index
		orderedContents = [...orderedContents.slice(0, newIndex), item, ...orderedContents.slice(newIndex)];

		obj[orderedContentsField] = orderedContents;
		obj.onChange();

		return moveRoot.moveRecord(item, newIndex, oldIndex, obj, oldParent)
			.then(minWait(SHORT))
			.then((savedItem) => {
				//after save, replace the optimistic placeholder with the real thing
				orderedContents[newIndex] = savedItem;

				obj[orderedContentsField] = orderedContents;
				obj.onChange();
			})
			.catch((reason) => {
				delete item.isSaving;

				Object.defineProperty(item, 'isNotSaved', {
					enumerable: false,
					value: true
				});

				Object.defineProperty(item, 'error', {
					enumerable: false,
					value: reason
				});

				obj.onChange();

				//continue the failure
				return Promise.reject(reason);
			});
	}
}

