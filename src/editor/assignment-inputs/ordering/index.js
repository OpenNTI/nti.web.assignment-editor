import Editor from './Editor';
import Button from './Button';
import {partsEqual} from './utils';
import {PROMPT} from '../';

export default class OrderingPart {
	//TODO: get this mime type from the model
	static handles = [
		'application/vnd.nextthought.assessment.orderingpart',
		'application/vnd.nextthought.assessment.randomizedorderingpart'
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
		return partsEqual(partA, partB);
	}
}

Button.handles = OrderingPart.handles;
Editor.handles = OrderingPart.handles;
