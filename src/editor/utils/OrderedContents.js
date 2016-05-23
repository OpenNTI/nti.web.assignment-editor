import {getService} from  'nti-web-client';
import uuid from 'node-uuid';
import minWait, {SHORT} from 'nti-commons/lib/wait-min';

const linkName = 'ordered-contents';

const fields = [
	'questions',
	'parts'
];

export default class OrderedContents {
	constructor (obj) {
		this.backingObject = obj;
	}


	get orderedContentsField () {
		const obj = this.backingObject;

		if (obj.getOrderedContents) {
			return obj.getOrderedContents();
		}

		for (let field of fields) {
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


	get link () {
		const obj = this.backingObject;

		return obj.getOrderedContentsLink ? obj.getOrderedContentsLink() : obj.getLink(linkName);
	}


	get canEdit () {
		return !!this.link;
	}

	/**
	 * Given an item optimistically add it to the items, and try to save it to the server.
	 * If it's successful, replace the optimistic placeholder with the item from the server.
	 * If it fails, add an error to the optimistic placeholder and trigger a change
	 * @param  {Object} item the item to append
	 * @return {Promise}      fulfills or rejects if the item is successfully added or not
	 */
	append (item) {
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

		orderedContents.push(item);

		obj[orderedContentsField] = orderedContents;
		obj.onChange();

		return getService()
			.then(service =>
				service.postParseResponse(link, item)
			)
			//Make sure we wait at least a little bit
			.then(minWait(SHORT))
			.then((savedItem) => {
				//after it has saved, replace the optimistic placeholder with the real thing
				orderedContents[orderedContents.length - 1] = savedItem;
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
}
