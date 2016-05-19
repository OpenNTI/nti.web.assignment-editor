import Editor from './Editor';
import Button from './Button';


export default class EditorPart {
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
