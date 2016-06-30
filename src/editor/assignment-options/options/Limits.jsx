import React, { PropTypes } from 'react';
import {scoped} from 'nti-lib-locale';
import {HOC, NumberInput} from 'nti-web-commons';

import OptionGroup from '../OptionGroup';
import Option from '../Option';

const getQuestionSet = (props) =>
	((((props || {}).assignment || {}).parts || [])[0] || {}).question_set;

const LIMIT_NONE = 'limit-none';
const LIMIT_PORTION = 'limit-porition';

const DEFAULT_TEXT = {
	content: 'Setting a max number of questions will result in unqiue quizzes with randomly chosen questions for every student.',
	labels: {
		all: 'All of the Questions',
		portion: 'Porition of the Questions'
	}
};

const t = scoped('OPTIONS_LIMITS', DEFAULT_TEXT);

class Limits extends React.Component {
	static propTypes = {
		assignment: PropTypes.object.isRequired
	}


	static getItem (props) {
		return getQuestionSet(props);
	}


	constructor (props) {
		super();

		this.setupValue(props);
	}


	setLimitInputRef = x => this.limitInputRef = x;


	setupValue (props = this.props) {
		const setState = s => this.state ? this.setState(s) : (this.state = s);
		const {draw} = getQuestionSet(props);

		setState({
			draw: typeof draw === 'number' ? draw : null
		});
	}


	componentWillReceiveProps (nextProps) {
		const current = getQuestionSet(this.props);
		const next = getQuestionSet(nextProps);

		if (current !== next) {
			this.setupValue(nextProps);
		}
	}


	/**
	 * onChange handles the setting of both limit to null, and limiting on a blur from the limit input
	 * @param  {event} e This is the event from the change or blur.
	 * @returns {none} nothing
	 */
	onChange = ({target}) => {
		if (this.busy) { return;}
		this.busy = true;

		const qset = getQuestionSet(this.props);

		let work;
		if (target.name === LIMIT_NONE) {
			work = qset.setQuestionLimit(null);
		}

		if (work) {
			const clearBusy = () => delete this.busy;
			work.then(clearBusy, clearBusy);
		}
	}


	onItemChanged = () => {
		this.setupValue();
	}


	onLimitBlur = ({target}) => {
		if (this.busy) { return;}
		this.busy = true;

		const qset = getQuestionSet(this.props);

		let work;
		if (target.name === LIMIT_PORTION) {
			work = qset.setQuestionLimit(this.limitInputRef.value);
		}

		if (work) {
			const clearBusy = () => delete this.busy;
			work.then(clearBusy, clearBusy);
		}
	}


	/**
	 * Upon typing in the limit input field, update the draw number to reflect the new value.
	 * This is not yet gone to the server to be saved.
	 * @param  {object} This is the event's target object.
	 * @returns {none} nothing
	 */
	onLimitChange = () => {
		this.setState({ draw: this.limitInputRef.value });
	}


	/**
	 * Upon clicking the porition checkbox, set it as checked.
	 * @returns {none} nothing
	 */
	onLimitSelect = () => {
		const {draw} = this.state;
		this.setState(
			{ draw: draw || 0 },
			() => this.limitInputRef.focus()
		);
	}


	render () {
		const {draw} = this.state;
		const value = typeof draw === 'number' ? true : false;

		return (
			<OptionGroup name="limiting" header="Max Limit" content={t('content')}>
				<Option label={t('labels.all')} type="radio" name={LIMIT_NONE} value={!value}  onChange={this.onChange}/>
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
