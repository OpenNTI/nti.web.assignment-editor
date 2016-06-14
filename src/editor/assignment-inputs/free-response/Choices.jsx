import React from 'react';

import AddButton from '../multiple-choice/AddButton';
import Choice from '../multiple-choice/Choice';

const addLabel = 'Add a Possible Answer';

export default class FreeResponseChoices extends React.Component {
	static propTypes = {
		choices: React.PropTypes.array.isRequired,
		onChange: React.PropTypes.func,
		onAdd: React.PropTypes.func,
		onRemove: React.PropTypes.func
	}


	constructor (props) {
		super(props);

		const {choices} = this.props;

		this.state = {
			choices
		};

		this.onAdd = this.onAdd.bind(this);
		this.onRemove = this.onRemove.bind(this);
		this.onChoiceChange = this.onChoiceChange.bind(this);

		this.renderChoice = this.renderChoice.bind(this);
	}


	componentWillReceiveProps (nextProps) {
		const {choices:newChoices} = nextProps;
		const {choices:oldChoices} = this.props;

		if (newChoices !== oldChoices) {
			this.setState({
				choices: newChoices
			});
		}
	}


	onChange () {
		const {onChange} = this.props;
		const {choices} = this.state;

		if (choices) {
			onChange(choices);
		}
	}


	onChoiceChange (choiceId, label) {
		let {choices} = this.state;

		choices = choices.map((choice) => {
			return (choice.ID === choiceId) ? {...choice, label} : choice;
		});

		this.setState({
			choices
		}, () => {
			this.onChange();
		});
	}


	onAdd () {
		const {onAdd} = this.props;

		if (onAdd) {
			onAdd();
		}
	}


	onRemove (choiceId) {
		const {onRemove} = this.props;

		if (onRemove) {
			onRemove(choiceId);
		}
	}


	render () {
		const {choices} = this.state;

		return (
			<div>
				{choices.map(this.renderChoice)}
				<AddButton onAdd={this.onAdd} label={addLabel} />
			</div>
		);
	}


	renderChoice (choice) {
		return (
			<Choice
				key={choice.ID}
				choice={choice}
				onChange={this.onChoiceChange}
				onRemove={this.onRemove}
				hideSolution
				plainText
			/>
		);
	}
}
