import React from 'react';
import cx from 'classnames';

function getCountInQuestion (question, types) {
	const {parts} = question;

	return (parts || []).reduce((acc, part) => {
		if (types[part.MimeType.toLowerCase()]) {
			acc += 1;
		}

		return acc;
	}, 0);
}


function getCountInPart (part, types) {
	const {question_set:questionSet} = part;
	const {questions} = questionSet;

	return (questions || []).reduce((acc, question) => {
		return acc + getCountInQuestion(question, types);
	}, 0);
}

export default class BaseButton extends React.Component {
	static propTypes = {
		assignment: React.PropTypes.object.isRequired
	}

	static set handles (handles) {
		this.handledMimetypes = handles;
	}

	static get handles () {
		return this.handledMimetypes;
	}


	iconCls = ''


	constructor (props) {
		super(props);

		this.state = {};

		this.onClick = this.onClick.bind(this);
	}


	onClick () {

	}


	getUsedCount () {
		const {assignment} = this.props;
		let types = this.constructor.handles;

		types = types.reduce((acc, type) => {
			acc[type] = true;

			return acc;
		}, {});

		return (assignment.parts || []).reduce((acc, part) => {
			return acc + getCountInPart(part, types);
		}, 0);
	}


	render () {
		const iconCls = cx('icon', this.iconCls);
		const {label} = this;
		const usedCount = this.getUsedCount();
		const usedCls = cx('used', {isUsed: usedCount > 0});

		return (
			<div className="button">
				<span className={iconCls}></span>
				<span className="label">{label}</span>
				<span className={usedCls}>{usedCount} used</span>
			</div>
		);
	}
}
