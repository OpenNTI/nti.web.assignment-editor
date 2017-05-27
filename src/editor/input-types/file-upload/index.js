import {PROMPT} from '../';

import Editor from './Editor';
import Button from './Button';
import {isPartEqual} from './utils';

export default class FileUploadPart {
	//TODO: get this mime type from the model
	static handles = [
		'application/vnd.nextthought.assessment.filepart'
	]


	static get button () {
		return Button;
	}


	static get editor () {
		return Editor;
	}


	static get contentPlaceholder () {
		return PROMPT;
	}


	static partsEqual (partA, partB) {
		return isPartEqual(partA, partB);
	}
}

Button.handles = FileUploadPart.handles;
Editor.handles = FileUploadPart.handles;
