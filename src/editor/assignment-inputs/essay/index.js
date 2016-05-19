import Editor from './Editor';
import Button from './Button';

export default class EssayPart {
	//TODO: get this mime type from the model
	static handles = [
		'application/vnd.nextthought.assessment.modeledcontentpart'
	]


	static get button () {
		return Button;
	}


	static get editor () {
		return Editor;
	}
}

Button.handles = EssayPart.handles;
Editor.handles = EssayPart.handles;
