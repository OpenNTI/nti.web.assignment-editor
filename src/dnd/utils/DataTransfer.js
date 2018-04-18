import Logger from '@nti/util-logger';

const logger = Logger.get('lib:dnd:DataTransfer');

export function getTransferKey (obj) {
	let key = '';

	if (obj.getKeyForDataTransfer) {
		key = obj.getKeyForDataTransfer();
	} else if (obj.dataTransferKey) {
		key = obj.dataTransferKey;
	} else if (obj.mimeType || obj.MimeType) {
		key = obj.mimeType || obj.MimeType;
	} else if (typeof obj === 'string') {
		key = obj;
	} else {
		logger.error('Unable to find key for: ', obj);
	}

	return key;
}

export function isSameData (a, b) {
	let equal = false;

	if (a.NTIID != null) {
		equal = a.NTIID === b.NTIID;
	} else if (a.ID != null) {
		equal = a.ID === b.ID;
	} else {
		equal = a === b;
	}

	return equal;
}

/**
 * Wrap some helper methods around setting and getting data from the dataTransfer object
 *
 * NOTE: if using this wrapper around data from a browser drag/drop event, the data will only be available
 * for that event pump. Afterwards the browser will not let us access it.
 */
export default class DataTransfer {
	/**
	 * Create a DataTransfer
	 * @param  {DataTransfer} dataTransfer the data transfer from the dnd event
	 */
	constructor (dataTransfer) {
		this.dataTransfer = dataTransfer;
		this.transferData = {};
	}


	get types () {
		return (this.dataTransfer && this.dataTransfer.types) || Object.keys(this.transferData) || [];
	}


	/**
	 * Add values to be set on the dataTransfer object.
	 * The value being stored, will either:
	 *
	 * 1) if it implements getDataForTransfer, store that return value
	 * 2) stringify the value
	 *
	 * If no value is passed assume that the key is the value to store and the key is either:
	 *
	 * 1) if the value implements dataForTransfer use it
	 * 2) if the value has a mimeType use it
	 * 3) if the value is a string use it
	 *
	 * If no key is provided or we are unable to find one nothing will be added to the data transfer
	 *
	 * @param {String|Mixed} key   the key to store the value on (typically a mimetype), or the object to store
	 * @param {Mixed} value the value to store
	 * @return {void}
	 */
	setData (key, value) {
		if (!value && key) {
			value = key;
			key = getTransferKey(value);
		}


		if (!key) {
			logger.error('No key provided for data transfer');
			return;
		}

		if (value.dataForTransfer) {
			value = value.dataForTransfer;
		} else {
			value = JSON.stringify(value);
		}

		this.transferData[key] = value;
	}


	/**
	 * Iterate the data that has been set with setData,
	 * call the function with key, value.
	 *
	 * Seemed useful for a functional way to set the data on the event
	 * instead of passing the event.
	 *
	 * @param  {Function} fn callback
	 * @return {void}
	 */
	forEach (fn) {
		let data = this.transferData;
		let keys = Object.keys(data);

		for (let key of keys) {
			fn(key, data[key]);
		}
	}

	/**
	 * If we've been given dataTransfer from an event check if the key is on there.
	 * If not check if its been set by setData.
	 *
	 * If the data is there, but we are not allowed to access it return true
	 *
	 * @param  {String} key the key to look for
	 * @return {String}		the value on data transfer for that key
	 */
	getData (key) {
		const {dataTransfer} = this;
		const {types} = dataTransfer || {};
		const data = dataTransfer && dataTransfer.getData(key);

		if (!dataTransfer) { return false; }

		// in firefox 'types' is a 'DOMStringList' which doesn't have an 'indexOf' method but does have 'contains'
		if (types.indexOf && types.indexOf(key) >= 0 || types.contains && types.contains(key)) {
			return data === '' ? true : data;
		}

		return false;
	}


	/**
	 * Get data for the key and try to parse it into json
	 *
	 * @param  {String} key the key to find
	 * @return {JSON}     the parsed JSON or null if it wasn't able to parse it
	 */
	getJSON (key) {
		let data = this.getData(key);

		try {
			data = JSON.parse(data);
		} catch (e) {
			data = null;
		}

		return data;
	}

	/**
	 * Return parsed JSON or the raw data for a key
	 *
	 * @param  {String} key the key to find
	 * @return {String|JSON}     the raw data or JSON if it would be parsed
	 */
	findDataFor (key) {
		return this.getJSON(key) || this.getData(key);
	}


	/**
	 * Figure out is the dataTansfer contains data for a key
	 *
	 * @param  {String} key the key to find
	 * @return {Boolean}     if it has that type of data or not
	 */
	containsType (key) {
		let types = this.dataTransfer && this.dataTransfer.types;
		let contains = false;

		if (types) {
			//FF returns a DomStringList which doesn't have an indexOf
			if (types.contains) {
				contains = types.contains(key);
			} else if (types.indexOf) {
				contains = types.indexOf(key) >= 0;
			}
		}

		//TODO: maybe search things that have been set with setData

		return contains;
	}
}
