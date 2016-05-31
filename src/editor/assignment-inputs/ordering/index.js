import Editor from './Editor';
import Button from './Button';

export default class OrderingPart {
	//TODO: get this mime type from the model
	static handles = [
		'application/vnd.nextthought.assessment.randomizedorderingpart',
		'application/vnd.nextthought.assessment.orderingpart'
	]


	static get button () {
		return Button;
	}


	static get editor () {
		return Editor;
	}
}

Button.handles = OrderingPart.handles;
Editor.handles = OrderingPart.handles;