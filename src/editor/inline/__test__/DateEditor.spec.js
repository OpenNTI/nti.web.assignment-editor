/* eslint-env jest */
import React from 'react';
import { mount } from 'enzyme';

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
	const selectMonth = function (cmp, month) {
		const monthPicker = cmp.find('.select-wrapper').at(0).find('.menu-label');
		monthPicker.simulate('click');
		cmp.update();
		return cmp.find('.select-wrapper').at(0).find('.option-label').at(month);
	};

	const selectYear = function (cmp, yearsFrom2018) {
		const getSelect = (x, text) => x.find('.select-wrapper').filterWhere(y => y.find('.select-box > .menu-label > .option-label').text() === text);
		const getSelectItem = (x, text) => x.find('li > .option-label').filterWhere(y => y.text() === String(text));

		getSelect(cmp, '2018').find('.menu-label').simulate('click');

		cmp.update();

		return getSelectItem(getSelect(cmp, '2018'), yearsFrom2018 + 2018);
	};

	const verifySelectedMonth = function (cmp, month) {
		const monthPicker = cmp.find('.select-wrapper').at(0).find('.menu-label');
		expect(monthPicker.text()).toEqual(month);
	};

	const verifySelectedDay = function (cmp, day) {
		const dayPicker = cmp.find('.select-wrapper').at(1).find('.menu-label');
		expect(dayPicker.text()).toEqual(day);
	};

	const verifySelectedYear = function (cmp, year) {
		const yearPicker = cmp.find('.select-wrapper').at(2).find('.menu-label');
		expect(yearPicker.text()).toEqual(year);
	};

	const verifySelectedDate = function (cmp, month, day, year) {
		verifySelectedMonth(cmp, month);
		verifySelectedDay(cmp, day);
		verifySelectedYear(cmp, year);
	};

	test('Test available days changes with month/year selections', async () => {
		let newDate = null;
		const date = new Date('2018-10-25T09:34:00Z');

		const onDateChanged = (d) => {
			newDate = new Date(d.getTime());
		};

		const cmp = mount(<DateEditor date={date} onDateChanged={onDateChanged}/>);

		// check that the initial month (October) has 31 day options in its state
		const octoberDays = cmp.state().availableDays;
		expect(octoberDays.length).toEqual(31);

		verifySelectedDate(cmp, 'October', '25', '2018');

		// select februrary from the month picker, which should change the available days to 28 (non-leap year)
		const february = selectMonth(cmp, MONTHS.FEBRUARY);
		february.simulate('click');
		cmp.setProps({ date: newDate });

		verifySelectedDate(cmp, 'February', '25', '2018');

		const februaryDays = cmp.state().availableDays;
		expect(februaryDays.length).toEqual(28);

		// select 2020 from year picker, which is a leap year, setting available days to 29
		const year2020 = selectYear(cmp, 2);
		year2020.simulate('click');
		cmp.setProps({ date: newDate });

		const februaryLeapYearDays = cmp.state().availableDays;
		expect(februaryLeapYearDays.length).toEqual(29);

		verifySelectedDate(cmp, 'February', '25', '2020');

		// go to a 30-day month (April)
		const april = selectMonth(cmp, MONTHS.APRIL);
		april.simulate('click');
		cmp.setProps({ date: newDate });

		const aprilDays = cmp.state().availableDays;
		expect(aprilDays.length).toEqual(30);

		verifySelectedDate(cmp, 'April', '25', '2020');

		// finally, go back to a 31-day month (December)
		const december = selectMonth(cmp, MONTHS.DECEMBER);
		december.simulate('click');
		cmp.setProps({ date: newDate });

		const decemberDays = cmp.state().availableDays;
		expect(decemberDays.length).toEqual(31);

		verifySelectedDate(cmp, 'December', '25', '2020');
	});

	test('Test selected day changes to closest available', async () => {
		let newDate = null;
		const date = new Date('10/31/18 04:34');

		const onDateChanged = (d) => {
			newDate = new Date(d.getTime());
		};

		const cmp = mount(<DateEditor date={date} onDateChanged={onDateChanged}/>);

		// check that initial selected day is 31
		expect(cmp.state().selectedDay).toEqual('31');

		verifySelectedDate(cmp, 'October', '31', '2018');

		// switch month to February, which only has 28 days
		// check that selected day has automatically changed to 28
		const february = selectMonth(cmp, MONTHS.FEBRUARY);
		february.simulate('click');
		cmp.setProps({ date: newDate });

		expect(cmp.state().selectedDay).toEqual('28');

		verifySelectedDate(cmp, 'February', '28', '2018');

		// switch to another month with 31 days (December) and check that
		// the 28th is still the selected day (selection is maintained)
		const december = selectMonth(cmp, MONTHS.DECEMBER);
		december.simulate('click');
		cmp.setProps({ date: newDate });

		expect(cmp.state().selectedDay).toEqual('28');

		verifySelectedDate(cmp, 'December', '28', '2018');
	});


	test('Test set to current', async () => {
		let newDate = null;
		const date = new Date(); // now

		const onDateChanged = (d) => {
			newDate = new Date(d.getTime());
		};

		const cmp = mount(<DateEditor date={date} onDateChanged={onDateChanged}/>);

		// click "Current Date/Time" link
		const setToCurrentLink = cmp.find('.set-current-date').first().find('a').first();
		setToCurrentLink.simulate('click');

		// let's just assume if the new date is later than or equal to the date we initialized the component with,
		// then the date was updated to the current time
		expect(newDate >= date).toBe(true);
	});
});
