export default class ControlsConfig {
	/**
	 * Create a config for the controls in the control bar.
	 *
	 * insertAt looks like:
	 * {
	 * 		before: Boolean,
	 * 		after: Boolean,
	 * 		item: Object
	 * }
	 *
	 * @param  {any} editor   [description]
	 * @param  {any} insertAt [description]
	 * @returns {any}          [description]
	 */
	constructor(editor, insertAt) {
		this.activeEditor = editor;
		this.activeInsertAt = insertAt;
	}

	get insertAt() {
		return this.activeInsertAt;
	}

	get editor() {
		return this.activeEditor;
	}
}
