import React from 'react';
import cx from 'classnames';

import Ordering from '../../../dnd/ordering/Ordering';
import Choice from './Choice';

const defaultLabel = 'Add a choice';

/**
 * Since a few different question types make use of a similar structure
 * that shares quite a bit of the same logic, this class is alright to extend
 */
export default class Choices extends React.Component {
	static propTypes = {
		choices: React.PropTypes.array.isRequired,
		accepts: React.PropTypes.any,
		error: React.PropTypes.object,
		className: React.PropTypes.string,
		containerId: React.PropTypes.string,
		onChange: React.PropTypes.func,
		add: React.PropTypes.func,
		remove: React.PropTypes.func,
		reorderable: React.PropTypes.bool,
		addLabel: React.PropTypes.string
	}


	static defaultProps = {
		accepts: [],
		addLabel: defaultLabel
	}


	className = ''


	constructor (props) {
		super(props);

		const {choices, accepts, add, remove, error} = this.props;
		let {columns, deletes} = this.mapColumns(choices);

		this.state = {
			columns,
			deletes,
			accepts,
			error,
			canAdd: !!add,
			canRemove: !!remove
		};

		this.setUpHandlers(columns, deletes);

		this.add = this.add.bind(this);
		this.remove = this.remove.bind(this);

		this.renderColumn = this.renderColumn.bind(this);
		this.renderDelete = this.renderDelete.bind(this);
		this.renderAdd = this.renderAdd.bind(this);
	}


	componentWillReceiveProps (nextProps) {
		const {choices:newChoices, error:newError} = nextProps;
		const {choices:oldChoices, error:oldError} = this.props;
		const {columns, deletes} = this.mapColumns(newChoices);
		let state = null;

		if (newChoices !== oldChoices) {
			state = state || {};

			state.columns = columns;
			state.deletes = deletes;

			this.setUpHandlers(columns, deletes);
		}


		if (newError !== oldError) {
			state = state || {};

			state.error = newError;
		}


		if (state) {
			this.setState(state);
		}
	}


	mapColumns (rows) {
		let columns = [];
		let deletes = [];

		for (let row of rows) {
			if (!Array.isArray(row)) {
				row = [row];
			}

			columns = row.reduce((acc, cell, index) => {
				if (!acc[index]) {
					acc[index] = [];
				}

				acc[index].push(cell);

				return acc;
			}, columns);


			//Don't allow the last choice to be deleted, since at least one is required
			if (rows.length > 1) {
				deletes.push(row.map(cell => cell.NTIID || cell.ID));
			}
		}

		return {
			columns,
			deletes
		};
	}


	setUpHandlers (columns, deletes) {
		this.orderChangeHandlers = [];
		this.choiceChangeHandlers = [];
		this.choiceRenders = [];
		this.deleteHandlers = [];

		for (let i = 0; i < columns.length; i++) {
			this.choiceRenders[i] = this.renderChoice.bind(this, i);
			this.orderChangeHandlers[i] = this.onOrderChange.bind(this, i);
			this.choiceChangeHandlers[i] = this.onChoiceChange.bind(this, i);
		}

		for (let i = 0; i < deletes.length; i++) {
			this.deleteHandlers[i] = this.remove.bind(this, deletes[i]);
		}
	}


	onChange () {
		const {onChange} = this.props;
		const {columns} = this.state;
		let rows = [];

		for (let column of columns) {
			if (!Array.isArray(column)) {
				column = [column];
			}

			rows = column.reduce((acc, cell, index) => {
				let accVal = acc[index];

				if (!accVal) {
					acc[index] = cell;
				} else if (!Array.isArray(accVal)) {
					acc[index] = [accVal, cell];
				} else {
					acc[index].push(cell);
				}

				return acc;
			}, rows);
		}

		if (onChange) {
			onChange(rows);
		}
	}


	onOrderChange (columnIndex, choices) {
		let {columns} = this.state;

		choices = choices.slice(0);

		columns[columnIndex] = choices;

		this.setState({
			columns
		}, () => {
			this.onChange();
		});
	}


	isSameChoice (a, b) {
		let equal = false;

		if (a.NTIID && a.NTIID === b.NTIID) {
			equal = true;
		} else if (a.ID && a.ID === b.ID) {
			equal = true;
		}

		return equal;
	}


	onChoiceChange (columnIndex, newChoice) {
		let {columns} = this.state;
		let column = columns[columnIndex];

		column = column.map((choice) => {
			if (this.isSameChoice(choice, newChoice)) {
				return {...choice, label: newChoice.label};
			}

			return choice;
		});

		columns[columnIndex] = column;

		this.setState({
			columns
		}, () => {
			this.onChange();
		});
	}


	add () {
		const {add} = this.props;

		if (add) {
			add();
		}
	}


	remove (ids) {
		const {remove} = this.props;

		if (remove) {
			remove(...ids);
		}
	}


	render () {
		const {className} = this.props;
		const {columns, deletes, canAdd, canRemove} = this.state;
		const cls = cx(className, this.className, 'assignment-input-choices',{'can-delete': canRemove});

		return (
			<div className={cls}>
				<div className="choices">
					{columns.map(this.renderColumn)}
					{canAdd ? this.renderAdd() : null}
				</div>
				{
					canRemove ?
						(
							<div className="delete">
								{deletes.map(this.renderDelete)}
							</div>
						) :
						null
				}
			</div>
		);
	}


	renderColumn (choices, index) {
		const {containerId, accepts, reorderable} = this.props;
		const renderChoice = this.choiceRenders[index];
		const onChange = this.orderChangeHandlers[index];
		const accept = accepts[index] ? [accepts[index]] : [];

		if (reorderable) {
			return (
				<Ordering
					key={containerId + '-' + index}
					className="choice-column"
					containerId={containerId}
					accepts={accept}
					items={choices}
					renderItem={renderChoice}
					onChange={onChange}
				/>
			);
		}

		return (
			<div key={containerId + '-' + index} className="choice-column">
				{choices.map(renderChoice)}
			</div>
		);
	}


	renderChoice (column, choice) {
		const {error} = this.state;

		return (
			<Choice
				key={choice.NTIID || choice.ID}
				choice={choice}
				onChange={this.choiceChangeHandlers[column]}
				error={choice.isErrorFor(error)}
			/>
		);
	}


	renderAdd () {
		const {addLabel} = this.props;

		return (
			<div className="add-choice" onClick={this.add}>
				<span>{addLabel}</span>
			</div>
		);
	}


	renderDelete (deletes, index) {
		const key = deletes.join('-');
		const handler = this.deleteHandlers[index];

		return (
			<div key={key} onClick={handler}>X</div>
		);
	}
}