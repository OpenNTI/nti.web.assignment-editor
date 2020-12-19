/* eslint-env jest */
import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import DateEditor from '../DateEditor';

const MONTHS = {
	JANUARY: 1,
	FEBRUARY: 2,
	MARCH: 3,
	APRIL: 4,
	MAY: 5,
	JUNE: 6,
	JULY: 7,
	AUGUST: 8,
	SEPTEMBER: 9,
	OCTOBER: 10,
	NOVEMBER: 11,
	DECEMBER: 12
};

describe('DateEditor test', () => {
	const selectMonth = function (el, month) {
		const monthPicker = el.querySelector('.select-wrapper .menu-label');
		fireEvent.click(monthPicker);

		return el.querySelectorAll('.select-wrapper .option-label')[month];
	};

	const selectYear = function (el, yearsFrom2018) {
		const getSelect = (x, text) => [...x.querySelectorAll('.select-wrapper')].filter(y => y.querySelector('.select-box > .menu-label > .option-label')?.textContent === text)[0];
		const getSelectItem = (x, text) => [...x.querySelectorAll('li > .option-label')].filter(y => y.textContent === String(text))[0];

		const select = getSelect(el, '2018');
		const label = select?.querySelector('.menu-label');

		fireEvent.click(label);


		return getSelectItem(getSelect(el, '2018'), yearsFrom2018 + 2018);
	};

	const verifySelectedMonth = function (el, month) {
		const monthPicker = el.querySelectorAll('.select-wrapper')[0].querySelector('.menu-label');
		expect(monthPicker.textContent).toEqual(month);
	};

	const verifySelectedDay = function (el, day) {
		const dayPicker = el.querySelectorAll('.select-wrapper')[1].querySelector('.menu-label');
		expect(dayPicker.textContent).toEqual(day);
	};

	const verifySelectedYear = function (el, year) {
		const yearPicker = el.querySelectorAll('.select-wrapper')[2].querySelector('.menu-label');
		expect(yearPicker.textContent).toEqual(year);
	};

	const verifySelectedDate = function (el, month, day, year) {
		verifySelectedMonth(el, month);
		verifySelectedDay(el, day);
		verifySelectedYear(el, year);
	};

	test('Test available days changes with month/year selections', async () => {
		let newDate = null;
		const date = new Date('2018-10-25T09:34:00Z');
		const ref = React.createRef();

		const onDateChanged = (d) => {
			newDate = new Date(d.getTime());
		};

		const withProps = (p) => <DateEditor ref={ref} date={date} onDateChanged={onDateChanged} {...p}/>;
		const {container, rerender} = render(withProps({}));

		const {current: cmp} = ref;

		// check that the initial month (October) has 31 day options in its state
		const octoberDays = cmp.state.availableDays;
		expect(octoberDays.length).toEqual(31);

		verifySelectedDate(container, 'October', '25', '2018');

		// select february from the month picker, which should change the available days to 28 (non-leap year)
		const february = selectMonth(container, MONTHS.FEBRUARY);
		fireEvent.click(february);
		rerender(withProps({ date: newDate }));

		verifySelectedDate(container, 'February', '25', '2018');

		const februaryDays = cmp.state.availableDays;
		expect(februaryDays.length).toEqual(28);

		// select 2020 from year picker, which is a leap year, setting available days to 29
		const year2020 = selectYear(container, 2);
		fireEvent.click(year2020);
		rerender(withProps({ date: newDate }));

		const februaryLeapYearDays = cmp.state.availableDays;
		expect(februaryLeapYearDays.length).toEqual(29);

		verifySelectedDate(container, 'February', '25', '2020');

		// go to a 30-day month (April)
		const april = selectMonth(container, MONTHS.APRIL);
		fireEvent.click(april);
		rerender(withProps({ date: newDate }));

		const aprilDays = cmp.state.availableDays;
		expect(aprilDays.length).toEqual(30);

		verifySelectedDate(container, 'April', '25', '2020');

		// finally, go back to a 31-day month (December)
		const december = selectMonth(container, MONTHS.DECEMBER);
		fireEvent.click(december);
		rerender(withProps({ date: newDate }));

		const decemberDays = cmp.state.availableDays;
		expect(decemberDays.length).toEqual(31);

		verifySelectedDate(container, 'December', '25', '2020');
	});

	test('Test selected day changes to closest available', async () => {
		let newDate = null;
		const date = new Date('10/31/18 04:34');
		const ref = React.createRef();

		const onDateChanged = (d) => {
			newDate = new Date(d.getTime());
		};

		const withProps = (p) => <DateEditor ref={ref} date={date} onDateChanged={onDateChanged} {...p}/>;
		const {container, rerender} = render(withProps({}));

		const {current: cmp} = ref;

		// check that initial selected day is 31
		expect(cmp.state.selectedDay).toEqual('31');

		verifySelectedDate(container, 'October', '31', '2018');

		// switch month to February, which only has 28 days
		// check that selected day has automatically changed to 28
		const february = selectMonth(container, MONTHS.FEBRUARY);
		fireEvent.click(february);
		rerender(withProps({ date: newDate }));

		expect(cmp.state.selectedDay).toEqual('28');

		verifySelectedDate(container, 'February', '28', '2018');

		// switch to another month with 31 days (December) and check that
		// the 28th is still the selected day (selection is maintained)
		const december = selectMonth(container, MONTHS.DECEMBER);
		fireEvent.click(december);
		rerender(withProps({ date: newDate }));

		expect(cmp.state.selectedDay).toEqual('28');

		verifySelectedDate(container, 'December', '28', '2018');
	});


	test('Test set to current', async () => {
		let newDate = null;
		const date = new Date(); // now

		const onDateChanged = (d) => {
			newDate = new Date(d.getTime());
		};

		const {container} = render(<DateEditor date={date} onDateChanged={onDateChanged}/>);

		// click "Current Date/Time" link
		const setToCurrentLink = container.querySelector('.set-current-date a');
		fireEvent.click(setToCurrentLink);

		// let's just assume if the new date is later than or equal to the date we initialized the component with,
		// then the date was updated to the current time
		expect(newDate >= date).toBe(true);
	});
});
