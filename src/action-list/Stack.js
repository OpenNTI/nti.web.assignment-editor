import EventEmitter from 'events';

const ACTION_STACK = Symbol('STACK');
const START_TIMER = Symbol('Start Timer');
const STOP_TIMER = Symbol('Stop Timer');
const SET_STACK = Symbol('Set Stack');

const DEFAULT_MAX_SHOW = 1;
const DEFAULT_MAX_DEPTH = 5;
const DEFAULT_KEEP_FOR = Infinity;

export default class ActionStack extends EventEmitter {
	constructor (config = {}) {
		super();

		this.seenCount = 0;

		//How many items are visible in the stack
		this.maxVisible = config.maxVisible || DEFAULT_MAX_SHOW;
		//How deep the stack can get, before we start pushing the next item out
		this.maxDepth = config.maxDepth || DEFAULT_MAX_DEPTH;
		this.keepFor = config.keepFor || DEFAULT_KEEP_FOR;

		this[ACTION_STACK] = [];
	}


	get next () {
		return this.unwrapAction(this[ACTION_STACK][0]);
	}


	get items () {
		const stack = this[ACTION_STACK];

		return stack.slice(0, this.maxVisible).map(this.unwrapAction);
	}


	get length () {
		const stack = this[ACTION_STACK];

		return Math.min(this.maxVisible, stack.length);
	}


	get depth () {
		return this[ACTION_STACK].length;
	}


	[SET_STACK] (stack) {
		this[ACTION_STACK] = stack;
		this.emit('changed');
	}


	[START_TIMER] (action) {
		if (action && this.keepFor !== Infinity) {
			action.timer = setTimeout(() => {
				if (action.onTimeout) {
					action.onTimeout();
				}

				this.clear(action);
			}, this.keepFor);
		}

		return action;
	}


	[STOP_TIMER] (action) {
		if (action && action.timer) {
			clearTimeout(action.timer);
			delete action.timer;
		}

		return action;
	}


	wrapAction (action) {
		const id = this.seenCount;
		const {label, name, onComplete, onTimeout} = action;
		let completed;

		return this[START_TIMER]({
			label, name,
			ID: id,
			complete: (...args) => {
				this.clear(id);

				completed = true;
				onComplete(...args);
			},
			onTimeout: () => {
				if (onTimeout && !completed) {
					onTimeout();
				}
			}
		}, this.keepFor);
	}


	unwrapAction (action) {
		return {
			label: action.label,
			name: action.name,
			complete: action.complete,
			timeout: action.onTimeout,
			ID: action.ID
		};
	}

	/**
	 * @callback OnCallback
	 * @param {*} someparam
	 * @return {void}
	 */


	/**
	 * Push an action on to the stack.
	 *
	 * If the stack is at the max depth, remove the oldest item.
	 * Start a timer to remove it after the keep for timeout has passed.
	 *

	 *
	 * @param  {Objcet|string} action - the action to push
	 * @param  {OnCallback} action.onComplete - Function to call when the user completes the action,
	 * @param  {OnCallback} action.onTimeout - Function to call when the timer to do the action runs out,
	 * @param  {string} action.label - String that gets displayed to identify the action,
	 * @param  {string} action.name - String that is used to label the button to perform the button
	 * @return {void}
	 */
	push (action) {
		this.seenCount += 1;

		let stack = this[ACTION_STACK];
		let wrapper = this.wrapAction(action);

		if (stack.length === this.maxDepth) {
			this[STOP_TIMER](stack[0]);

			stack = stack.slice(0, -1);
		}

		stack = [wrapper, ...stack];

		this[SET_STACK](stack);
	}


	/**
	 * If given an action, remove that action from the stack. Otherwise clear the entire stack.
	 *
	 * @param  {Object|string} action the action to remove
	 * @return {void}
	 */
	clear (action) {
		let stack = this[ACTION_STACK];

		if (action) {
			action = action.ID || action;
			stack = stack.filter((q) => {
				let remove = false;

				if (q.ID === action) {
					this[STOP_TIMER](q);
					remove = true;
				}

				return !remove;
			});
		} else {
			stack = [];
		}

		this[SET_STACK](stack);
	}
}
