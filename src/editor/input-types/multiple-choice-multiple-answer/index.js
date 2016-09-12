import Editor from './Editor';
import Button from './Button';
import {partsEqual} from './utils';

export default class MultipleChoiceMultipleAnswerPart {
	//TODO: get this mime type from the model
	static handles = [
		'application/vnd.nextthought.assessment.multiplechoicemultipleanswerpart',
		'application/vnd.nextthought.assessment.randomizedmultiplechoicemultipleanswerpart'

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

Button.handles = MultipleChoiceMultipleAnswerPart.handles;
Editor.handles = MultipleChoiceMultipleAnswerPart.handles;
