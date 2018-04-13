/* eslint-env jest */
import React from 'react';
import { mount } from 'enzyme';

import Publish, {PUBLISH, SCHEDULE, DRAFT} from '../Publish';

describe('Publish controls test', () => {
	const assignment = {
		hasLink: (rel) => {
			return rel === 'unpublish';
		}
	};

	const assignmentRef = {
		NTIID: 'refID'
	};

	test('Test publish type', async () => {
		const cmp = mount(<Publish selectedType={PUBLISH} assignment={assignment} assignmentRef={assignmentRef}/>);

		expect(cmp.find('.publish-label').first().text()).toEqual('Assignment is visible to students');
		expect(cmp.find('.schedule-container').exists()).toBe(false);
		expect(cmp.find('.draft-container').exists()).toBe(false);

		expect(cmp.find('.date-editor').exists()).toBe(false);
	});

	test('Test schedule type', async () => {
		const date = new Date('10/25/18');

		const cmp = mount(<Publish selectedType={SCHEDULE} scheduledDate={date} assignment={assignment} assignmentRef={assignmentRef}/>);

		expect(cmp.find('.schedule-label').first().text()).toEqual('When do you want students to have access to the assignment?');
		expect(cmp.find('.publish-container').exists()).toBe(false);
		expect(cmp.find('.draft-container').exists()).toBe(false);

		const dateEditor = cmp.find('.date-editor').first();

		expect(dateEditor.text()).toMatch(/October.*25.*2018/);
	});

	test('Test draft type', async () => {
		const cmp = mount(<Publish selectedType={DRAFT} assignment={assignment} assignmentRef={assignmentRef}/>);

		expect(cmp.find('.draft-label').first().text()).toEqual('Currently not visible to any students');
		expect(cmp.find('.publish-container').exists()).toBe(false);
		expect(cmp.find('.schedule-container').exists()).toBe(false);

		expect(cmp.find('.date-editor').exists()).toBe(false);
	});
});
