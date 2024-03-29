/* eslint-env jest */
import Stack from '../Stack';

function createAction(label, onComplete) {
	label = label || '';
	onComplete = onComplete || (() => {});

	return {
		label,
		onComplete,
	};
}

describe('Action Stack Tests', () => {
	test('Stack is never longer than the max size', () => {
		const queue = new Stack({ maxVisible: 2 });

		queue.push(createAction('First'));

		expect(queue.length).toEqual(1);

		queue.push(createAction('Second'));

		expect(queue.length).toEqual(2);

		queue.push(createAction('Third'));

		expect(queue.length).toEqual(2);
	});

	test('Stack is never deeper than the max depth', () => {
		const queue = new Stack({ maxDepth: 2, maxVisible: 1 });

		queue.push(createAction('First'));

		expect(queue.depth).toEqual(1);

		queue.push(createAction('Second'));

		expect(queue.depth).toEqual(2);

		queue.push(createAction('Third'));

		expect(queue.depth).toEqual(2);
	});

	describe('No time limit tests', () => {
		let queue;
		let listeners;

		beforeEach(() => {
			listeners = {
				changed: () => {},
			};

			queue = new Stack({ maxVisible: 2 });

			jest.spyOn(listeners, 'changed');

			queue.addListener('changed', listeners.changed);
		});

		test('Pushing Item fires changed', () => {
			queue.push(createAction('First'));

			expect(listeners.changed).toHaveBeenCalled();
		});

		test('Pushing one item and completing it, fires changed and empties the queue', () => {
			queue.push(createAction('First'));

			let action = queue.next;

			action.complete();

			expect(listeners.changed).toHaveBeenCalledTimes(2);
			expect(queue.length).toEqual(0);
		});

		test('Pushing more than one items, and completing all of them', () => {
			const first = 'First';
			const second = 'Second';
			const third = 'Third';

			queue.push(createAction(first));
			queue.push(createAction(second));
			queue.push(createAction(third));

			expect(queue.length).toEqual(2);
			expect(listeners.changed).toHaveBeenCalledTimes(3);

			let action = queue.next;

			action.complete();

			expect(action.label).toEqual(third);
			expect(listeners.changed).toHaveBeenCalledTimes(4);
			expect(queue.length).toEqual(2);

			action = queue.next;
			action.complete();

			expect(action.label).toEqual(second);
			expect(listeners.changed).toHaveBeenCalledTimes(5);
			expect(queue.length).toEqual(1);

			action = queue.next;

			action.complete();

			expect(action.label).toEqual(first);
			expect(listeners.changed).toHaveBeenCalledTimes(6);
			expect(queue.length).toEqual(0);
		});
	});

	describe('Time limit tests', () => {
		let queue;
		let listeners;

		beforeEach(() => {
			listeners = {
				changed: () => {},
			};

			queue = new Stack({ maxVisible: 2, keepFor: 250 });

			jest.spyOn(listeners, 'changed');

			queue.addListener('changed', listeners.changed);
		});

		test('Pushing an item and waiting for the timeout to pass', done => {
			queue.push(createAction('TEST'));

			setTimeout(() => {
				expect(queue.length).toEqual(0);
				expect(listeners.changed).toHaveBeenCalledTimes(2);

				done();
			}, 500);
		});
	});
});
