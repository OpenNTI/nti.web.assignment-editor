import Editor, {Placeholder} from './Editor';
import Button from './Button';
import {partsEqual} from './utils';

export default class MultipleChoicePart {
	//TODO: get this mime type from the model
	//The first mimeType in the array is what gets created by default
	static handles = [
		'application/vnd.nextthought.assessment.multiplechoicepart',
		'application/vnd.nextthought.assessment.randomizedmultiplechoicepart'
	]


	static get button () {
		return Button;
	}


	static get editor () {
		return Editor;
	}


	static partsEqual (partA, partB) {
		return partsEqual(partA, partB);
	}
}

Button.handles = MultipleChoicePart.handles;
Editor.handles = MultipleChoicePart.handles;

export {Placeholder};
