export default class ControlsConfig {
	constructor (editor, item) {
		this.activeEditor = editor;
		this.activeItem = item;
	}


	get item () {
		return this.activeItem;
	}


	get editor () {
		return this.activeEditor;
	}
}
