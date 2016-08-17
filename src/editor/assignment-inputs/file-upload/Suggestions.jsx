import React from 'react';
import SuggestionItem from './SuggestionItem';

const TYPE_GROUPS = {
	'Documents': ['.pdf', '.doc', '.docx', '.txt'],
	'Spreadsheets': ['.xls', '.xlsx', '.csv'],
	'Images': ['.png', '.jpg', '.jepg', '.gif']
};

export default class Suggestions extends React.Component {

	constructor (props) {
		super(props);
		this.state = {dismissed:[]};
	}

	static propTypes = {
		tokens: React.PropTypes.array,
		onSelect: React.PropTypes.func
	}

	static defaultProps = {
		tokens: []
	}

	getSuggestions () {
		const {tokens = []} = this.props;
		const tokenSet = new Set(tokens);
		const {dismissed} = this.state;
		const dismissedSet = new Set(dismissed);

		const s = tokens.map((token) => {
			let target = [];
			for (let key in TYPE_GROUPS) {
				if (TYPE_GROUPS.hasOwnProperty(key)) {
					let group = TYPE_GROUPS[key];
					if (group.indexOf(token) !== -1)  {
						target = group;
						break;
					}
				}
			}
			if (target) {
				return target.filter(x => !tokenSet.has(x) && !dismissedSet.has(x));
			}
			return target;
		});

		let result = [];
		if (s.length > 0) {
			result = s.reduce((prev, curr) => prev.concat(curr));
			result = Array.from(new Set(result));
		}
		return result;
	}

	onAddSuggestion = (value) => {
		const {onSelect} = this.props;
		if (value && onSelect) {
			onSelect(value);
		}
	}

	onDismiss = (value) => {
		const {dismissed} = this.state;
		this.setState({dismissed: [...dismissed, value]});
	}


	render () {
		const list = this.getSuggestions();
		return (
			<div>
			{list.length > 0 && (
				<div className="assignment-input-fileupload-suggestions-wrapper">
					<div className="title">People who entered these extensions, also added:</div>
					<div className="suggestions">
					{list.map((value) =>
						<SuggestionItem
							key={'suggestion' + value.replace(/\./g, '-')}
							value={value}
							onAdd={this.onAddSuggestion}
							onDismiss={this.onDismiss} controls
						/>
					)}
					</div>
				</div>
			)}
			</div>
		);
	}
}
