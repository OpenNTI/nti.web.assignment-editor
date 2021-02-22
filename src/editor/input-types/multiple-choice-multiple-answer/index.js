import Editor from './Editor';
import Button from './Button';
import { partsEqual, generatePartFor } from './utils';

const defaultChoices = ['Choice 1'];
const defaultSolution = [0];
const defaultHint = [];

export default class MultipleChoiceMultipleAnswerPart {
	//TODO: get this mime type from the model
	static handles = [
		'application/vnd.nextthought.assessment.multiplechoicemultipleanswerpart',
		'application/vnd.nextthought.assessment.randomizedmultiplechoicemultipleanswerpart',
	];

	static get button() {
		return Button;
	}

	static get editor() {
		return Editor;
	}

	static partsEqual(partA, partB) {
		return partsEqual(partA, partB);
	}

	static generatePartFor(...args) {
		return generatePartFor(...args);
	}

	static getBlankPart() {
		const { handles } = this.constructor;
		let mimeType = handles && handles[0];

		if (mimeType) {
			return generatePartFor(
				mimeType,
				null,
				defaultChoices,
				defaultSolution,
				defaultHint
			);
		}
	}
}

Button.handles = MultipleChoiceMultipleAnswerPart.handles;
Editor.handles = MultipleChoiceMultipleAnswerPart.handles;
