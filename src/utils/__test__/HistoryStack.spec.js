import HistoryStack from '../HistoryStack';

describe('History Stack tests', () => {
	describe('Empty State', () => {
		let stack;

		beforeEach(() => {
			stack = new HistoryStack();
		});

		it('Undo is disabled', () => {
			expect(stack.canUndo).toBeFalsy();
		});


		it('Redo is disabled', () => {
			expect(stack.canRedo).toBeFalsy();
		});


		it('Undo returns undefined', () => {
			expect(stack.undo()).toBeFalsy();
		});


		it('Redo returns undefined', () => {
			expect(stack.redo()).toBeFalsy();
		});
	});

	describe('2 pushes', () => {
		let stack;

		beforeEach(() => {
			stack = new HistoryStack();

			stack.push({index: 0});
			stack.push({index: 1});
		});


		it('Undo is enabled', () => {
			expect(stack.canUndo).toBeTruthy();
		});


		it ('Redo is disabled', () => {
			expect(stack.canRedo).toBeFalsy();
		});


		it('Undo returns the second state, and enables redo', () => {
			let state = stack.undo();

			expect(stack.canRedo).toBeTruthy();
			expect(state.index).toEqual(0);
		});


		it('2 undos returns the undefined, disables undo, and enables redo', () => {
			stack.undo();
			let state = stack.undo();

			expect(state).toBeFalsy();
			expect(stack.canUndo).toBeFalsy();
			expect(stack.canRedo).toBeTruthy();
		});


		it('Redo returns the current state', () => {
			let state = stack.redo();

			expect(state.index).toEqual(1);
		});
	});


	describe('3 pushes and 1 undo', () => {
		let stack;

		beforeEach(()=> {
			stack = new HistoryStack();

			stack.push({index: 0});
			stack.push({index: 1});
			stack.push({index: 2});

			stack.undo();
		});

		it('Undo is enabled', () => {
			expect(stack.canUndo).toBeTruthy();
		});


		it('Redo is enabled', () => {
			expect(stack.canRedo).toBeTruthy();
		});


		it('Undo returns the first state, enables undo, and enables redo', () => {
			let state = stack.undo();

			expect(state.index).toEqual(0);
			expect(stack.canUndo).toBeTruthy();
			expect(stack.canRedo).toBeTruthy();
		});


		it('2 undos returns undefined, disables redo, and enables redo', () => {
			stack.undo();
			let state = stack.undo();

			expect(state).toBeFalsy();
			expect(stack.canUndo).toBeFalsy();
			expect(stack.canRedo).toBeTruthy();
		});


		it('Push disables redo', () => {
			stack.push({index: 3});

			expect(stack.canRedo).toBeFalsy();
		});

		it('Redo returns last state, and disables redo', () => {
			let state = stack.redo();

			expect(state.index).toBe(2);
			expect(stack.canRedo).toBeFalsy();
		});
	});
});
