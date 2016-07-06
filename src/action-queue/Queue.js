import EventEmitter from 'events';

const ACTION_QUEUE = Symbol('QUEUE');
const START_TIMER = Symbol('Start Timer');
const STOP_TIMER = Symbol('Stop Timer');
const SET_QUEUE = Symbol('Set QUEUE');

const DEFAULT_MAX_SHOW = 1;
const DEFAULT_MAX_DEPTH = 5;
const DEFAULT_KEEP_FOR = Infinity;

export default class ActionQueue extends EventEmitter {
	constructor (config = {}) {
		super();

		this.seenCount = 0;

		//How many items are visible in the queue
		this.maxVisible = config.maxVisible || DEFAULT_MAX_SHOW;
		//How deep the queue can get, before we start pushing the next item out
		this.maxDepth = config.maxDepth || DEFAULT_MAX_DEPTH;
		this.keepFor = config.keepFor || DEFAULT_KEEP_FOR;

		this[ACTION_QUEUE] = [];
	}


	get next () {
		return this.unwrapAction(this[ACTION_QUEUE][0]);
	}


	get items () {
		const queue = this[ACTION_QUEUE];

		return queue.slice(0, this.maxVisible).map(this.unwrapAction);
	}


	get length () {
		const queue = this[ACTION_QUEUE];

		return Math.min(this.maxVisible, queue.length);
	}


	get depth () {
		return this[ACTION_QUEUE].length;
	}


	[SET_QUEUE] (queue) {
		this[ACTION_QUEUE] = queue;
		this.emit('changed');
	}


	[START_TIMER] (action) {
		if (action && this.keepFor !== Infinity) {
			action.timer = setTimeout(() => {
				this.clear(action);
			}, this.keepFor);
		}

		return action;
	}


	[STOP_TIMER] (action) {
		if (action) {
			clearTimeout(action);
		}

		return action;
	}


	wrapAction (action) {
		const id = this.seenCount;
		const {label, name, onComplete} = action;

		return this[START_TIMER]({
			label, name,
			ID: id,
			complete: (...args) => {
				this.clear(id);

				onComplete(...args);
			}
		}, this.keepFor);
	}


	unwrapAction (action) {
		return {
			label: action.label,
			name: action.name,
			complete: action.complete,
			ID: action.ID
		};
	}


	/**
	 * Push an action on to the queue.
	 *
	 * If the queue is at the max depth, remove the oldest item.
	 * Start a timer to remove it after the keep for timeout has passed.
	 *
	 * Is an object that looks like:
	 * {
	 * 	onComplete: Function to call when the user completes the action,
	 * 	onTimeout: Function to call when the timer to do the action runs out,
	 * 	label: String that gets displayed to identify the action,
	 * 	name: String that is used to label the button to perform the button
	 * }
	 *
	 * @param  {String} action the action to push
	 * @return {void}
	 */
	push (action) {
		this.seenCount += 1;

		let queue = this[ACTION_QUEUE];
		let wrapper = this.wrapAction(action);

		if (queue.length === this.maxDepth) {
			this[STOP_TIMER](queue[0]);

			queue = queue.slice(1);
		}

		queue = [...queue, wrapper];

		this[SET_QUEUE](queue);
	}


	/**
	 * If given an action, remove that action from the queue. Otherwise clear the entire queue.
	 *
	 * @param  {Object|String} action the action to remove
	 * @return {void}
	 */
	clear (action) {
		let queue = this[ACTION_QUEUE];

		if (action) {
			action = action.ID || action;
			queue = queue.filter((q) => {
				let remove = false;

				if (q.ID === action) {
					this[STOP_TIMER](q);
					remove = true;
				}

				return !remove;
			});
		} else {
			queue = [];
		}

		this[SET_QUEUE](queue);
	}
}
