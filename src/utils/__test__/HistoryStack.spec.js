import HistoryStack from '../HistoryStack';

describe('History Stack tests', () => {
	it('Empty can\'t undo or redo', () => {
		let stack = new HistoryStack();

		expect(stack.canUndo).toBeFalsy();
		expect(stack.canRedo).toBeFalsy();
	});


	it('Pushing state enables undo', () => {
		let stack = new HistoryStack();

		stack.push({test: 1});

		expect(stack.canUndo).toBeTruthy();
		expect(stack.canRedo).toBeFalsy();
	});


	describe('With 1 previous state, and no redos', () => {
		let stack;

		beforeEach(() => {
			stack = new HistoryStack();
			stack.push({test: 0});
		});


		it('Undo returns null', () => {
			let state = stack.undo();

			expect(state).toBeFalsy();
		});


		it('Redo returns undefined', () => {
			let state = stack.redo();

			expect(state).toBeFalsy();
		});


		it('Undo disables undo', () => {
			stack.undo();

			expect(stack.canUndo).toBeFalsy();
		});


		it('Undo enables redo', () => {
			stack.undo();

			expect(stack.canRedo).toBeTruthy();
		});
	});


	describe('With 2 previous states, and no redos', () => {
		let stack;

		beforeEach(() => {
			stack = new HistoryStack();
			stack.push({test: 0});
			stack.push({test: 1});
		});


		it('Undo returns the first state', () => {
			let state = stack.undo();

			expect(state.test).toEqual(0);
		});


		it('Redo returns undefined', () => {
			let state = stack.redo();

			expect(state).toBeFalsy();
		});


		it('Undo leaves undo enabled', () => {
			stack.undo();

			expect(stack.canUndo).toBeTruthy();
		});


		it('Undo enables redo', () => {
			stack.undo();

			expect(stack.canRedo).toBeTruthy();
		});
	});


	describe('With no previous states, and 1 redo', () => {
		let stack;

		beforeEach(() => {
			stack = new HistoryStack();

			stack.push({test: 0});
			stack.undo();
		});


		it('Push clears and disables redo', () => {
			stack.push({test: 1});

			let state = stack.redo();

			expect(stack.canRedo).toBeFalsy();
			expect(state).toBeFalsy();
		});


		it('Undo returns undefined', () => {
			let state = stack.undo();

			expect(state).toBeFalsy();
		});


		it('Redo returns the first redo', () => {
			let state = stack.redo();

			expect(state.test).toEqual(0);
		});


		it('Redo enables undo', () => {
			stack.redo();

			expect(stack.canUndo).toBeTruthy();
		});

		it('Redo disables redo', () => {
			stack.redo();

			expect(stack.canRedo).toBeFalsy();
		});
	});


	describe('With no previous states, and 2 redos', () => {
		let stack;

		beforeEach(() => {
			stack = new HistoryStack();

			stack.push({test: 0});
			stack.push({test: 1});
			stack.undo();
		});


		it('Push clears and disables redo', () => {
			stack.push({test: 2});

			let state = stack.redo();

			expect(stack.canRedo).toBeFalsy();
			expect(state).toBeFalsy();
		});


		it('Undo returns undefined', () => {
			let state = stack.undo();

			expect(state).toBeFalsy();
		});


		it('Redo returns the first redo', () => {
			let state = stack.redo();

			expect(state.test).toEqual(1);
		});


		it('Redo enables undo', () => {
			stack.redo();

			expect(stack.canUndo).toBeTruthy();
		});

		it('Redo leaves redo enabled', () => {
			stack.redo();

			expect(stack.canRedo).toBeFalsy();
		});
	});
});
