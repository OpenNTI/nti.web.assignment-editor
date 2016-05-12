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

		if (p.currentState !== undefined) {
			p.undo.push(p.currentState);
		}
		p.redo = [];

		p.currentState = state;
	}


	undo () {
		let p = PRIVATE.get(this);

		if (this.canUndo) {
			p.redo.push(p.currentState);
			p.currentState = p.undo.pop();
		}

		return p.currentState;
	}


	redo () {
		let p = PRIVATE.get(this);

		if (this.canRedo) {
			p.undo.push(p.currentState);
			p.currentState = p.redo.pop();
		}

		return p.currentState;
	}


	get canUndo () {
		return PRIVATE.get(this).currentState !== undefined;
	}


	get canRedo () {
		return PRIVATE.get(this).redo.length !== 0;
	}


	get currentState () {
		return PRIVATE.get(this).currentState;
	}
}
