const PRIVATE = new WeakMap();

export default class HistoryStack {
	constructor () {
		PRIVATE.set(this, {
			undo: [],
			redo: []
		});
	}


	push (state) {
		let p = PRIVATE.get(this);

		p.undo.push(state);
		p.redo = [];
	}


	undo () {
		let p = PRIVATE.get(this);
		let state;

		if (p.undo.length > 0) {
			state = p.undo.pop();
			p.redo.push(state);
			state = p.undo[0];
		}

		return state;
	}


	redo () {
		let p = PRIVATE.get(this);
		let state;

		if (p.redo.length > 0) {
			state = p.redo.pop();
			p.undo.push(state);
		}

		return state;
	}


	get canUndo () {
		return PRIVATE.get(this).undo.length !== 0;
	}


	get canRedo () {
		return PRIVATE.get(this).redo.length !== 0;
	}
}
