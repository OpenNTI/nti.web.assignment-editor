import React from 'react';
import cx from 'classnames';
import autobind from 'nti-commons/lib/autobind';

import {SyncHeightGroup} from '../../../sync-height';
import {Ordering} from '../../../dnd/';

import Choice from './Choice';
import PlainChoice from './PlainChoice';
import {isErrorForChoice} from './Factory';
import AddChoice from './AddChoice';

const defaultLabel = 'Add a choice';

function createSyncHeightGroup () {
	return new SyncHeightGroup();
}


function createDeleteListForColumns (columns, minAllowed) {
	//This assumes all the columns are the same height
	const firstColumn = columns[0] || [];
	const columnLength = firstColumn.length;

	if (columnLength <= minAllowed) {
		return [];
	}

	let deletes = [];

	for (let i = 0; i < columnLength; i++) {
		deletes[i] = columns.reduce((acc, column) => {
			acc.push(column[i].NTIID || column[i].ID);

			return acc;
		}, []);
	}

	return deletes;
}

/*
 * Since a few different question types make use of a similar structure
 * that shares quite a bit of the same logic, this class is alright to extend
 *
 * Given an array of rows where the cells were generated by the choice factory.
 * The items in the rows will try to sync their heights.
 */
export default class Choices extends React.Component {
	static propTypes = {
		choices: React.PropTypes.array.isRequired,
		accepts: React.PropTypes.any,
		error: React.PropTypes.object,
		className: React.PropTypes.string,
		containerId: React.PropTypes.string,
		onChange: React.PropTypes.func,
		buildBlankChoice: React.PropTypes.func,
		canRemove: React.PropTypes.bool,
		reorderable: React.PropTypes.bool,
		addLabel: React.PropTypes.string,
		minAllowed: React.PropTypes.number,
		plainText: React.PropTypes.bool
	}


	static defaultProps = {
		accepts: [],
		addLabel: defaultLabel,
		minAllowed: 1
	}


	className = ''


	constructor (props) {
		super(props);

		const {choices, accepts, buildBlankChoice, canRemove, error, minAllowed} = this.props;
		let {columns, deletes} = this.mapColumns(choices, minAllowed);

		this.state = {
			columns,
			deletes,
			accepts,
			error,
			canAdd: !!buildBlankChoice,
			canRemove
		};

		this.setUpHandlers(columns, deletes);

		//Because of inheritance these have to be bound
		autobind(this,
			'renderColumn',
			'renderAdd'
		);
	}


	componentWillReceiveProps (nextProps) {
		const {choices:newChoices, error:newError, minAllowed} = nextProps;
		const {choices:oldChoices, error:oldError} = this.props;
		const {columns, deletes} = this.mapColumns(newChoices, minAllowed);
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


	mapColumns (rows, minAllowed) {
		let columns = [];

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
		}

		const deletes = createDeleteListForColumns(columns, minAllowed);

		return {
			columns,
			deletes
		};
	}


	setUpHandlers (columns, deletes) {
		const canDelete = deletes.length > 1;

		this.orderChangeHandlers = [];
		this.choiceChangeHandlers = [];
		this.choiceRenders = [];
		this.focusNextHandlers = [];
		this.focusPrevHandlers = [];
		this.insertNewHandlers = [];
		this.deleteHandlers = [];
		this.deleteRowHandlers = [];

		for (let i = 0; i < columns.length; i++) {
			this.choiceRenders[i] = this.renderChoice.bind(this, i);
			this.orderChangeHandlers[i] = this.onOrderChange.bind(this, i);
			this.choiceChangeHandlers[i] = this.onChoiceChange.bind(this, i);
			this.focusNextHandlers[i] = this.focusNext.bind(this, i);
			this.focusPrevHandlers[i] = this.focusPrev.bind(this, i);
			this.insertNewHandlers[i] = this.insertNewChoiceAfter.bind(this, i);

			if (canDelete) {
				this.deleteRowHandlers[i] = this.maybeDeleteRow.bind(this, i);
			}
		}

		for (let i = 0; i < deletes.length; i++) {
			this.deleteHandlers[i] = this.remove.bind(this, deletes[i]);
		}
	}


	clearRowSyncs () {
		this.rowSyncs = {};
	}


	getSyncForRow (row) {
		this.rowSyncs = this.rowSyncs || {};

		if (!this.rowSyncs[row]) {
			this.rowSyncs[row] = createSyncHeightGroup();
		}

		return this.rowSyncs[row];
	}


	onChange = () => {
		const {onChange} = this.props;
		const {columns} = this.state;
		let rows = [];

		// toFocus is always the previous choice
		if (this.toFocus) {
			this.toFocus.focusToEnd();
			delete this.toFocus;
		}

		for (let column of columns) {
			if (!Array.isArray(column)) {
				column = [column];
			}

			rows = column.reduce((acc, cell, index) => {
				let accVal = acc[index];

				cell.isNew = false;

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
		const {minAllowed} = this.props;
		let {columns} = this.state;
		const oldColumn = columns[columnIndex];
		const oldChoices = oldColumn.reduce((acc, choice) => {
			acc[choice.NTIID || choice.ID] = choice;

			return acc;
		}, {});

		choices = choices.slice(0);

		columns[columnIndex] = choices.map(x => oldChoices[x.NTIID || x.ID]);

		this.clearRowSyncs();

		const deletes = createDeleteListForColumns(columns, minAllowed);

		this.setUpHandlers(columns, deletes);

		this.setState({
			columns,
			deletes
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
				choice = choice.clone();
				choice.label = newChoice.label;

				return choice;
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


	insertNewChoiceAt = (index) => {
		const {buildBlankChoice, minAllowed} = this.props;

		if (!buildBlankChoice) {
			return false;
		}

		const {columns} = this.state;
		const column = columns[0];

		if (index < 0) {
			index = column.length;
		}

		for (let i = 0; i < columns.length; i++) {
			let oldColumn = columns[i];
			let newItem = buildBlankChoice(oldColumn.slice(0));

			let newColumn = [...oldColumn.slice(0, index), newItem, ...oldColumn.slice(index)];
			columns[i] = newColumn.map((cell, cellIndex) => {
				cell.index = cellIndex;
				return cell;
			});
		}

		const deletes = createDeleteListForColumns(columns, minAllowed);

		this.setUpHandlers(columns, deletes);

		this.setState({
			columns,
			deletes
		}, () => {
			this.onChange();
		});

		return true;
	}


	insertNewChoiceAfter = (columnIndex, choice) => {
		const {columns} = this.state;
		const column = columns[columnIndex];
		let index = column.findIndex(x => x.ID === choice.ID);

		return this.insertNewChoiceAt(index + 1);
	}


	add = () => {
		return this.insertNewChoiceAt(-1);
	}


	remove = (ids) => {
		const {canRemove, minAllowed} = this.props;

		if (!canRemove) { return; }

		const {columns} = this.state;

		for (let i = 0; i < columns.length; i++) {
			let column = columns[i];
			let toRemove = ids[i];

			column = column.filter((choice) => {
				const choiceId = choice.NTIID || choice.ID;

				return toRemove !== choiceId;
			});

			columns[i] = column.map((cell, cellIndex) => {
				cell.index = cellIndex;

				return cell;
			});
		}

		const deletes = createDeleteListForColumns(columns, minAllowed);

		this.setUpHandlers(columns, deletes);

		this.setState({
			columns,
			deletes
		}, () => {
			this.onChange();
		});
	}


	getChoiceAfter (columnIndex, choice) {
		const {columns} = this.state;

		let column = columns[columnIndex];
		let index = column.findIndex(x => x.ID === choice.ID);

		if (columnIndex === columns.length - 1) {
			column = columns[0];
			index += 1;
		} else {
			column = columns[columnIndex + 1];
		}

		return column && column[index];
	}


	getChoiceBefore (columnIndex, choice) {
		const {columns} = this.state;

		let column = columns[columnIndex];
		let index = column.findIndex(x => x.ID === choice.ID);

		if (columnIndex === 0) {
			column = columns[columns.length - 1];
			index -= 1;
		} else {
			column = columns[columnIndex - 1];
		}

		return column && column[index];
	}


	maybeDeleteRow = (columnIndex, choice) => {
		const {columns} = this.state;
		const prevChoice = this.getChoiceBefore(columnIndex, choice);

		function focusPrev () {
			if (prevChoice) {
				prevChoice.focusToEnd();
			}
		}

		//If we aren't the first column just focus the previous
		if (columnIndex !== 0) {
			focusPrev();
			return;
		}

		//If there is only one column, just remove the choice and focus the previous
		if (columns.length === 1) {
			this.toFocus = prevChoice;//mark choice to focus after the removals
			this.remove([choice.NTIID || choice.ID]);
			return;
		}

		//If there is more than one row only delete it if the other cells are empty
		const choiceColumn = columns[columnIndex];
		const cellIndex = choiceColumn.findIndex(x => x.ID === choice.ID);
		let toDelete = [choice.NTIID || choice.ID];

		for (let i = 1; i < columns.length; i++) {
			let cell = columns[i][cellIndex];

			if (cell.label === '') {
				toDelete.push(cell.NTIID || cell.ID);
			} else {
				break;
			}
		}

		if (toDelete.length === columns.length) {
			this.toFocus = prevChoice;//mark choice to focus after the removals
			this.remove(toDelete);
		} else if (prevChoice) {
			focusPrev();
		}
	}


	focusNext = (columnIndex, choice) => {
		const {columns} = this.state;

		//If we only have one column let the native events handle it
		if (columns.length === 1) { return false; }

		const nextChoice = this.getChoiceAfter(columnIndex, choice);

		if (nextChoice) {
			nextChoice.focus();
			return true;
		}
	}


	focusPrev = (columnIndex, choice/*, force*/) => {
		// const {columns} = this.state;

		//If we only have one column let the native events handle it
		// if (columns.length === 1 && !force) { return false; }

		const prevChoice = this.getChoiceBefore(columnIndex, choice);

		if (prevChoice) {
			prevChoice.focusToEnd();
			return true;
		}
	}


	render () {
		const {className} = this.props;
		const {columns, canAdd, canRemove} = this.state;
		const cls = cx(className, this.className, 'assignment-input-choices',{'can-delete': canRemove});

		return (
			<div className={cls}>
				<div className="choices">
					{columns.map(this.renderColumn)}
				</div>
				<div className="choices add">
					{canAdd ? this.renderAdd() : null}
				</div>
			</div>
		);
	}


	renderColumn = (choices, index) => {
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
			<div key={containerId + '-' + index} className="choice-column no-reorder">
				{choices.map(renderChoice)}
			</div>
		);
	}


	renderChoice (column, choice, row) {
		const {plainText} = this.props;
		const {error, canRemove} = this.state;
		const onChange = this.choiceChangeHandlers[column];
		const focusNext = this.focusNextHandlers[column];
		const focusPrev = this.focusPrevHandlers[column];
		const insertNewChoice = this.insertNewHandlers[column];
		const maybeDeleteRow = canRemove ? this.deleteRowHandlers[column] : void 0;
		const choiceError = isErrorForChoice(error, choice);
		const sync = this.getSyncForRow(row);
		const onDelete = canRemove ? this.deleteHandlers[row] : void 0;
		const Cmp = plainText ? PlainChoice : Choice;

		return (
			<Cmp
				key={choice.NTIID || choice.ID}
				choice={choice}
				heightSyncGroup={sync}
				onChange={onChange}
				error={choiceError}
				onDelete={onDelete}
				plainText={plainText}
				focusNext={focusNext}
				focusPrev={focusPrev}
				insertNewChoiceAfter={insertNewChoice}
				maybeDeleteRow={maybeDeleteRow}
			/>
		);
	}

	renderAdd () {
		const {addLabel} = this.props;

		return (
			<AddChoice
				addLabel={addLabel}
				add={this.add}
			/>
		);
	}
}
