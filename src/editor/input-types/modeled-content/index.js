import { PROMPT } from '../';

import Editor from './Editor';
import Button from './Button';
import { partsEqual } from './utils';

export default class EssayPart {
	//TODO: get this mime type from the model
	static handles = [
		'application/vnd.nextthought.assessment.modeledcontentpart',
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
}

Button.handles = EssayPart.handles;
Editor.handles = EssayPart.handles;
