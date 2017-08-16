import Editor, {Placeholder} from './Editor';
import Button from './Button';
import {partsEqual, generatePartFor} from './utils';

const defaultChoices = ['Choice 1'];
const defaultSolution = 0;
const defaultHint = [];

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

	static generatePartFor (...args) {
		return generatePartFor(...args);
	}

	static getBlankPart () {
		const {handles} = MultipleChoicePart;
		let mimeType = handles && handles[0];

		if (mimeType) {
			return generatePartFor(mimeType, null, defaultChoices, defaultSolution, defaultHint);
		}
	}
}

Button.handles = MultipleChoicePart.handles;
Editor.handles = MultipleChoicePart.handles;

export {Placeholder};
