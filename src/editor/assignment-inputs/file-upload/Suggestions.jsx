import React from 'react';

const TYPE_GROUPS = {
	'Documents': ['.pdf', '.doc', '.docx', '.txt'],
	'Spreadsheets': ['.xls', '.xlsx', '.csv'],
	'Images': ['.png', '.jpg', '.jepg', '.gif']
};

export default class Suggestions extends React.Component {
	static propTypes = {
		tokens: React.PropTypes.array,
		onChange: React.PropTypes.func
	}

	static defaultProps = {
		tokens: []
	}

	constructor (props) {
		super(props);
		this.state = {tokens: props.tokens};
	}

	getSuggestions () {
		const {tokens = []} = this.state;
		const tokenSet = new Set(tokens);
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
				target = new Set(target.filter(x => !tokenSet.has(x)));
				return Array.from(target);
			}
			return target;
		});

		return s.length > 0 ? s.reduce((prev, curr) => prev.concat(curr)) : [];
	}

	updateList (tokens) {
		this.setState({tokens});
	}

	onClick = (e) => {
		const value = e.target.getAttribute('value');
		const {onChange} = this.props;
		if (value && onChange) {
			onChange(value);
		}
	}

	render () {
		const list = this.getSuggestions();
		return list.length > 0 ? <div className="suggestions">{list.map(x => this.renderItem(x))}</div> : <span />;
	}

	renderItem (item) {
		return <span className="token item" key={`type-${item}`} value={item} onClick={this.onClick}>{item}</span>;
	}
}
