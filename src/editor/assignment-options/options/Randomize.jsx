import React, { PropTypes } from 'react';
import OptionGroup from '../OptionGroup';
import Option from '../Option';

const RANDOMIZE_QUESTIONS = 'randomize-questions';
const RANDOMIZE_ANSWERS = 'randomize-answers';

const getQuestionSet = (props) =>
	((((props || {}).assignment || {}).parts || [])[0] || {}).question_set;


export default class Randomize extends React.Component {
	static propTypes = {
		assignment: PropTypes.object.isRequired
	}


	onChange = (e) => {
		if (this.busy) { return; }
		this.busy = true;

		const {target} = e;
		const qset = getQuestionSet(this.props);

		let work;
		if(target.name === RANDOMIZE_QUESTIONS) {
			work = qset.toggleRandomized();
		} else if (target.name === RANDOMIZE_ANSWERS) {
			work = qset.toggleRandomizedPartTypes();
		}

		if (work) {
			const clearBusy = () => delete this.busy;
			work.then(clearBusy, clearBusy);
		}
	}

	render () {
		const orderingContent = 'Randomizing will override the order of the questions and answers you created.';
		const qset = getQuestionSet(this.props);
		const {isRandomized, isPartTypeRandomized} = qset;
		const editable = qset.hasLink('edit');

		return (
			<OptionGroup name="ordering" header="Randomize Ordering" content={orderingContent}>
				<Option label="Randomize Question Order" name={RANDOMIZE_QUESTIONS} value={isRandomized} onChange={this.onChange} disabled={!editable}/>
				<Option label="Randomize Answer Order" name={RANDOMIZE_ANSWERS} value={isPartTypeRandomized} onChange={this.onChange} disabled={!editable}/>
			</OptionGroup>
		);
	}
}
