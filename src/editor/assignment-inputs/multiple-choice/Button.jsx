import Base from '../base/Button';
import {generatePartFor} from './Actions';

const defaultChoices = ['Choice 1'];
const defaultSolution = 0;
const defaultHint = [];

export default class MultipleChoiceButton extends Base {
	label = 'Multiple Choice'
	defaultQuestionContent = 'Multiple Choice Question'

	constructor (props) {
		super(props);

		this.state = {};
	}


	getBlankPart () {
		const {handles} = this.constructor;
		let mimeType = handles && handles[0];

		if (mimeType) {
			return generatePartFor(mimeType, this.defaultQuestionContent, defaultChoices, defaultSolution, defaultHint);
		}
	}
}
