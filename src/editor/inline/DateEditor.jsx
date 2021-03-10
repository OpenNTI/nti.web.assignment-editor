import './DateEditor.scss';
import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { scoped } from '@nti/lib-locale';
import { SelectBox, TimePicker } from '@nti/web-commons';

const DEFAULT_TEXT = {
	month: 'Month',
	day: 'Day',
	year: 'Year',
};
const t = scoped(
	'course.overview.lesson.items.questionset.editor.AssignmentEditorDateEditor',
	DEFAULT_TEXT
);

const MONTHS = [
	{
		label: 'January',
		value: '0',
	},
	{
		label: 'February',
		value: '1',
	},
	{
		label: 'March',
		value: '2',
	},
	{
		label: 'April',
		value: '3',
	},
	{
		label: 'May',
		value: '4',
	},
	{
		label: 'June',
		value: '5',
	},
	{
		label: 'July',
		value: '6',
	},
	{
		label: 'August',
		value: '7',
	},
	{
		label: 'September',
		value: '8',
	},
	{
		label: 'October',
		value: '9',
	},
	{
		label: 'November',
		value: '10',
	},
	{
		label: 'December',
		value: '11',
	},
];

export default class AssignmentEditorDateEditor extends React.Component {
	static propTypes = {
		date: PropTypes.object,
		onDueDateChecked: PropTypes.func,
		onDateChanged: PropTypes.func,
		disabled: PropTypes.bool,
	};

	state = {};

	constructor(props) {
		super(props);
	}

	componentDidMount() {
		this.loadFromDate(this.props.date);
	}

	componentDidUpdate(oldProps) {
		if (oldProps.date !== this.props.date) {
			this.loadFromDate(this.props.date);
		}
	}

	loadFromDate(date) {
		const now = new Date();
		const selectedDate = date || now;
		const thisYear = now.getFullYear();
		const selectedMonth = selectedDate
			? selectedDate.getMonth().toString()
			: '0';

		let availableYears = Array.apply(null, { length: 6 })
			.map(Number.call, Number)
			.map(n => {
				return {
					label: (n + thisYear).toString(),
					value: (n + thisYear).toString(),
				};
			});

		const selectedDateYear = selectedDate.getFullYear().toString();

		// handle a selected year not in the default range by placing it at the
		// top of the select options
		if (!availableYears.map(x => x.value).includes(selectedDateYear)) {
			availableYears = [
				{
					label: selectedDateYear,
					value: selectedDateYear,
				},
				...availableYears,
			];
		}

		this.setState({
			selectedMonth,
			selectedDay: selectedDate ? selectedDate.getDate().toString() : '1',
			availableDays: this.getDaysForMonth(
				selectedMonth,
				selectedDate ? selectedDate.getFullYear() : thisYear
			),
			availableYears,
			selectedYear: selectedDate
				? selectedDate.getFullYear().toString()
				: thisYear.toString(),
			selectedDate,
		});
	}

	getDaysForMonth(month, year) {
		let numDays = 31;

		if (month === '8' || month === '3' || month === '5' || month === '10') {
			numDays = 30;
		}

		if (month === '1') {
			numDays = 28;

			if (parseInt(year, 10) % 4 === 0) {
				numDays = 29;
			}
		}

		return Array.apply(null, { length: numDays })
			.map(Number.call, Number)
			.map(n => {
				return { label: (n + 1).toString(), value: (n + 1).toString() };
			});
	}

	getDayForSelection(availableDays) {
		let selectedDay;

		const dayValues = availableDays.map(o => parseInt(o.value, 10));
		const highestValue = dayValues[dayValues.length - 1];

		if (this.state.selectedDay > highestValue) {
			selectedDay = highestValue.toString();
		} else {
			selectedDay = this.state.selectedDay;
		}

		return selectedDay;
	}

	onMonthChange = val => {
		const { onDateChanged } = this.props;
		const { selectedDate } = this.state;
		const date = new Date(selectedDate);

		if (onDateChanged) {
			const availableDays = this.getDaysForMonth(
				val,
				this.state.selectedYear
			);
			const newSelectedDay = this.getDayForSelection(availableDays);

			date.setDate(parseInt(newSelectedDay, 10));
			date.setMonth(parseInt(val, 10));

			onDateChanged(date);
		}
	};

	onDayChange = val => {
		const { onDateChanged } = this.props;
		const { selectedDate } = this.state;
		const date = new Date(selectedDate);

		if (onDateChanged) {
			date.setDate(parseInt(val, 10));

			onDateChanged(date);
		}
	};

	onYearChange = val => {
		const { onDateChanged } = this.props;
		const { selectedDate } = this.state;
		const date = new Date(selectedDate);

		if (onDateChanged) {
			const availableDays = this.getDaysForMonth(
				this.state.selectedMonth,
				val
			);
			const newSelectedDay = this.getDayForSelection(availableDays);

			date.setDate(parseInt(newSelectedDay, 10));
			date.setFullYear(parseInt(val, 10));

			onDateChanged(date);
		}
	};

	setDateToCurrent = () => {
		const { onDateChanged } = this.props;

		if (onDateChanged) {
			onDateChanged(new Date());
		}
	};

	updateDate = newDate => {
		const { onDateChanged } = this.props;

		if (onDateChanged) {
			onDateChanged(newDate);
		}
	};

	render() {
		const {
			selectedMonth,
			selectedDay,
			selectedYear,
			selectedDate,
		} = this.state;
		const { disabled } = this.props;

		if (!selectedDate) {
			return null;
		}

		const cls = cx('date-editor', { disabled });

		return (
			<div className={cls}>
				<div className="select-wrapper select-month">
					<div className="label">{t('month')}</div>
					<SelectBox
						options={MONTHS}
						onChange={this.onMonthChange}
						value={selectedMonth}
						disabled={disabled}
						showSelectedOption
					/>
				</div>
				<div className="select-wrapper select-day">
					<div className="label">{t('day')}</div>
					<SelectBox
						options={this.state.availableDays}
						onChange={this.onDayChange}
						value={selectedDay}
						disabled={disabled}
						showSelectedOption
					/>
				</div>
				<div className="select-wrapper select-year">
					<div className="label">{t('year')}</div>
					<SelectBox
						options={this.state.availableYears}
						onChange={this.onYearChange}
						value={selectedYear}
						disabled={disabled}
						showSelectedOption
					/>
				</div>
				<div className="time-wrapper">
					<TimePicker
						value={selectedDate}
						onChange={this.updateDate}
						disabled={disabled}
					/>
				</div>
				<div className="set-current-date">
					or
					<a onClick={this.setDateToCurrent} disabled={disabled}>
						Current Date/Time
					</a>
				</div>
			</div>
		);
	}
}
