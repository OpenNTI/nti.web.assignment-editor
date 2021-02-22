import { PROMPT } from '../';

import Editor from './Editor';
import Button from './Button';
import { partsEqual, generatePartFor } from './utils';

const defaultLabels = ['Label 1', 'Label 2'];
const defaultValues = ['Value 1', 'Value 2'];
const defaultSolution = { 0: 0, 1: 1 };

export default class OrderingPart {
	//TODO: get this mime type from the model
	static handles = [
		'application/vnd.nextthought.assessment.orderingpart',
		'application/vnd.nextthought.assessment.randomizedorderingpart',
	];

	static get button() {
		return Button;
	}

	static get editor() {
		return Editor;
	}

	static get contentPlaceholder() {
		return PROMPT;
	}

	static partsEqual(partA, partB) {
		return partsEqual(partA, partB);
	}

	static generatePartFor(...args) {
		return generatePartFor(...args);
	}

	static getBlankPart() {
		const { handles } = OrderingPart;
		let mimeType = handles && handles[0];

		if (mimeType) {
			return generatePartFor(
				mimeType,
				null,
				defaultLabels,
				defaultValues,
				defaultSolution
			);
		}
		return {};
	}
}

Button.handles = OrderingPart.handles;
Editor.handles = OrderingPart.handles;
