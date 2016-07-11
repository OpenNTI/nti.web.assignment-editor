import React, { PropTypes } from 'react';
import {scoped} from 'nti-lib-locale';
import {HOC, NumberInput} from 'nti-web-commons';

import OptionGroup from './OptionGroup';
import Option from './Option';

const LIMIT_NONE = 'limit-none';
const LIMIT_PORTION = 'limit-porition';

const DEFAULT_TEXT = {
	content: 'Setting a max number of questions will result in unqiue quizzes with randomly chosen questions for every student.',
	disabled: 'Add some questions to enable this option.',
	labels: {
		all: 'All of the Questions',
		portion: 'Portion of the Questions'
	}
};

const t = scoped('OPTIONS_LIMITS', DEFAULT_TEXT);

class Limits extends React.Component {
	static propTypes = {
		assignment: PropTypes.object,
		questionSet: PropTypes.object
	}

	static isQuestionSetOption = true


	static getItem (props) {
		return props.questionSet;
	}


	constructor (props) {
		super();

		this.setupValue(props);
	}


	setLimitInputRef = x => this.limitInputRef = x;


	setupValue (props = this.props) {
		const setState = s => this.state ? this.setState(s) : (this.state = s);
		const {questionSet} = props;
		const {draw} = questionSet || {};

		setState({
			draw: (typeof draw === 'number' ? draw : 0) || null
		});
	}


	componentWillReceiveProps (nextProps) {
		const {questionSet:current} = this.props;
		const {questionSet:next} = nextProps;

		if (current !== next) {
			this.setupValue(nextProps);
		}
	}


	componentDidUpdate (_, prevState) {
		const {questionSet} = this.props;
		const prevValue = prevState.draw || null;
		const value = this.state.draw || null;

		//draw changed, but the questionSet is the same.
		if (value !== prevValue && questionSet === _.questionSet) {
			clearTimeout(this.saveDelay);
			this.saveDelay = setTimeout(this.save, 500);
		}
	}


	onItemChanged = () => {
		this.setupValue();
	}


	onLimitBlur = () => {
		const {value} = this.limitInputRef;
		this.setState({draw: value || null}, this.save);
	}


	/**
	 * Upon typing in the limit input field, update the draw number to reflect the new value.
	 * This is not yet gone to the server to be saved.
	 * @returns {void}
	 */
	onLimitChange = () => {
		const {value} = this.limitInputRef;
		if (value < 0) { return; }
		this.setState({ draw: value });
	}


	/**
	 * Upon clicking the porition checkbox, set it as checked.
	 * @returns {void}
	 */
	onLimitSelect = () => {
		const {draw} = this.state;
		this.setState(
			{ draw: draw || 0 },
			() => this.limitInputRef.focus()
		);
	}


	onUnlimitedSelected = () => {
		this.setState({draw: null});
	}


	save = () => {
		clearTimeout(this.saveDelay);
		const {props: {questionSet:qset}, state: {draw}} = this;
		const value = draw || null;

		const afterOthers = () => (this.busy || Promise.resolve()).catch(()=>{}); // the .catch(()=>{}) prevents rejections from interuppting the chain

		let work;
		if (qset.draw !== value) {
			work = afterOthers().then(() => qset.setQuestionLimit(value));
		}

		if (work) {
			const clearBusy = () => work === this.busy && delete this.busy;
			work = this.busy = work
				.catch(() => this.setState({draw: qset.draw}))
				.then(clearBusy);
		}
	}


	render () {
		const {questionSet} = this.props;
		const {draw} = this.state;
		const value = typeof draw === 'number' ? true : false;

		return (
			<OptionGroup
				name="limiting"
				header="Max Limit"
				content={t('content')}
				disabled={!questionSet}
				disabledText={t('disabled')}
			>
				<Option label={t('labels.all')} type="radio" name={LIMIT_NONE} value={!value}  onChange={this.onUnlimitedSelected}/>
				<Option label={t('labels.portion')} type="radio" value={value} onChange={this.onLimitSelect} />
				<NumberInput
					className="portion-max-input"
					placeholder="Max set of questions"
					min="0"
					value={draw || ''}
					name={LIMIT_PORTION}
					ref={this.setLimitInputRef}
					onBlur={this.onLimitBlur}
					onFocus={this.onLimitSelect}
					onChange={this.onLimitChange}
				/>
			</OptionGroup>
		);
	}
}

export default HOC.ItemChanges.compose(Limits);
