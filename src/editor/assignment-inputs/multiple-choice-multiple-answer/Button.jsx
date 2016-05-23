import Base from '../base/Button';
import {generatePartFor} from '../multiple-choice/Actions';

const defaultChoices = ['Choice 1'];
const defaultSolution = [0];
const defaultHint = [];

export default class MultipleChoiceMultipleAnswerButton extends Base {
	label = 'Multiple Choice Multiple Answer'
	defaultQuestionContent = 'Multiple Choice Multiple Answer Question'

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
