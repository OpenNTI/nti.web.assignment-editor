import Editor from './Editor';
import Button from './Button';
import {partsEqual} from './utils';

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


	static partsEqual (partA, partB) {
		return partsEqual(partA, partB);
	}
}

Button.handles = FileUploadPart.handles;
Editor.handles = FileUploadPart.handles;
