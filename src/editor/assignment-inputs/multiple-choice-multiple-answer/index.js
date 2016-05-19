import Editor from './Editor';
import Button from './Button';

import base from '../base';

export default class MultipleChoiceMultipleAnswerPart extends base {
	//TODO: get this mime type from the model
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
}
