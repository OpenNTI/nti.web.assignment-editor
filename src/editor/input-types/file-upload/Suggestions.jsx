import React from 'react';
import SuggestionItem from './SuggestionItem';

const TYPE_GROUPS = {
	'Documents': ['.pdf', '.doc', '.docx', '.txt'],
	'Spreadsheets': ['.xls', '.xlsx', '.csv'],
	'Images': ['.png', '.jpg', '.jepg', '.gif']
};

export default class Suggestions extends React.Component {

	static propTypes = {
		tokens: React.PropTypes.array,
		onSelect: React.PropTypes.func
	}

	static defaultProps = {
		tokens: []
	}

	state = {dismissed:[]}

	getSuggestions () {
		const {tokens = []} = this.props;
		const {dismissed} = this.state;

		const suggestions = tokens.map((token) => {
			const target = Object.values(TYPE_GROUPS).find(x => x.includes(token)) || [];
			return target.filter(x => !tokens.includes(x) && !dismissed.includes(x));
		});

		return suggestions.reduce((acc, list) => acc.concat(list.filter(x => !acc.includes(x))), []);
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
				<div className="input-type-fileupload-suggestions-wrapper">
					<div className="title">People who entered these extensions also added:</div>
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
