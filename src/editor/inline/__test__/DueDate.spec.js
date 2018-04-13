/* eslint-env jest */
import React from 'react';
import { mount } from 'enzyme';

import DueDate from '../DueDate';

describe('DueDate test', () => {
	const selectMonth = function (cmp, month) {
		const monthPicker = cmp.find('.select-wrapper').at(0).find('.menu-label');
		monthPicker.simulate('click');
		cmp.update();
		return cmp.find('.select-wrapper').at(0).find('.option-label').at(month);
	};

	test('Test date state changes', async () => {
		let newDate = null;
		let dueDateChecked = false;
		const date = new Date('10/25/18 04:34');

		const onDateChanged = (d) => {
			newDate = new Date(d.getTime());
		};

		const onDueDateChecked = (val) => {
			dueDateChecked = val;
		};

		const cmp = mount(<DueDate date={date} dueDateChecked={dueDateChecked} onDueDateChecked={onDueDateChecked} onDateChanged={onDateChanged}/>);

		let dateEditor = cmp.find('.date-editor').first();

		// initially not checked, editor should have a disabled classname
		expect(dateEditor.prop('className')).toMatch(/disabled/);

		// update to checked=true
		cmp.setProps({dueDateChecked: true});
		cmp.update();

		dateEditor = cmp.find('.date-editor').first();

		// now checked, editor should NOT have a disabled classname
		expect(dateEditor.prop('className')).not.toMatch(/disabled/);

		// check that date editing works
		const february = selectMonth(cmp, 2);
		february.simulate('click');

		// newDate should have a month of 1 (Februrary but 0-indexed)
		expect(newDate.getMonth()).toEqual(1);
	});
});
