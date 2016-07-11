import React from 'react';
import cx from 'classnames';
import autobind from 'nti-commons/lib/autobind';
import buffer from 'nti-commons/lib/function-buffer';

import {SyncHeightGroup} from '../../../sync-height';
import {Ordering} from '../../../dnd/';

import Choice from './Choice';
import {isErrorForChoice} from './Factory';

function createSyncHeightGroup () {
	return new SyncHeightGroup();
}

const defaultLabel = 'Add a choice';

/**
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

		autobind(this,
			'add',
			'remove',
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
			if (rows.length > minAllowed) {
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


	onChange = buffer(500, () => {
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
	})


	onOrderChange (columnIndex, choices) {
		let {columns} = this.state;
		const oldColumn = columns[columnIndex];
		const oldChoices = oldColumn.reduce((acc, choice) => {
			acc[choice.NTIID || choice.ID] = choice;

			return acc;
		}, {});

		choices = choices.slice(0);

		columns[columnIndex] = choices.map(x => oldChoices[x.NTIID || x.ID]);

		this.clearRowSyncs();

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


	add () {
		const {buildBlankChoice} = this.props;

		if (!buildBlankChoice) {
			return;
		}

		const {columns} = this.state;

		for (let i = 0; i < columns.length; i++) {
			let column = columns[i];

			column.push(buildBlankChoice(column.slice(0)));
		}

		this.setState({
			columns
		}, () => {
			this.onChange();
		});
	}


	remove (ids) {
		const {canRemove} = this.props;

		if (!canRemove) { return; }

		const {columns} = this.state;

		for (let i = 0; i < columns.length; i++) {
			let column = columns[i];
			let toRemove = ids[i];

			column = column.filter((choice) => {
				const choiceId = choice.NTIID || choice.ID;

				return toRemove !== choiceId;
			});

			columns[i] = column;
		}

		this.setState({
			columns
		}, () => {
			this.onChange();
		});
	}


	render () {
		const {className} = this.props;
		const {columns, canAdd, canRemove} = this.state;
		const cls = cx(className, this.className, 'assignment-input-choices',{'can-delete': canRemove});

		return (
			<div className={cls}>
				<div className="choices">
					{columns.map(this.renderColumn)}
					{canAdd ? this.renderAdd() : null}
				</div>
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
			<div key={containerId + '-' + index} className="choice-column no-reorder">
				{choices.map(renderChoice)}
			</div>
		);
	}


	renderChoice (column, choice, row) {
		const {plainText} = this.props;
		const {error, canRemove} = this.state;
		const onChange = this.choiceChangeHandlers[column];
		const choiceError = isErrorForChoice(error, choice);
		const sync = this.getSyncForRow(row);
		const onDelete = canRemove && this.deleteHandlers[row];

		return (
			<Choice
				key={choice.NTIID || choice.ID}
				choice={choice}
				heightSyncGroup={sync}
				onChange={onChange}
				error={choiceError}
				onDelete={onDelete}
				plainText={plainText}
			/>
		);
	}


	renderAdd () {
		const {addLabel} = this.props;

		return (
			<div className="add-choice" onClick={this.add}>
				<i className="icon-add" />
				<span>{addLabel}</span>
			</div>
		);
	}
}
