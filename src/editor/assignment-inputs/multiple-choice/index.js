import Editor from './Editor';
import Button from './Button';

export default class MultipleChoicePart {
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

Button.handles = MultipleChoicePart.handles;
Editor.handles = MultipleChoicePart.handles;
