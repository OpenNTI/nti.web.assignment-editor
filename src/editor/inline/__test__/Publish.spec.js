/* eslint-env jest */
import { render } from '@testing-library/react';

import Publish, { PUBLISH, SCHEDULE, DRAFT } from '../Publish';

describe('Publish controls test', () => {
	const assignment = {
		hasLink: rel => {
			return rel === 'unpublish';
		},
	};

	const assignmentRef = {
		NTIID: 'refID',
	};

	test('Test publish type', async () => {
		const { container } = render(
			<Publish
				selectedType={PUBLISH}
				assignment={assignment}
				assignmentRef={assignmentRef}
			/>
		);

		expect(container.querySelector('.publish-label')?.textContent).toEqual(
			'Assignment is visible to students'
		);
		expect(container.querySelector('.schedule-container')).toBe(null);
		expect(container.querySelector('.draft-container')).toBe(null);
		expect(container.querySelector('.date-editor')).toBe(null);
	});

	test('Test schedule type', async () => {
		const date = new Date('10/25/18');

		const { container } = render(
			<Publish
				selectedType={SCHEDULE}
				scheduledDate={date}
				assignment={assignment}
				assignmentRef={assignmentRef}
			/>
		);

		expect(container.querySelector('.schedule-label')?.textContent).toEqual(
			'When do you want students to have access to the assignment?'
		);
		expect(container.querySelector('.publish-container')).toBe(null);
		expect(container.querySelector('.draft-container')).toBe(null);

		expect(container.querySelector('.date-editor').textContent).toMatch(
			/October.*25.*2018/
		);
	});

	test('Test draft type', async () => {
		const { container } = render(
			<Publish
				selectedType={DRAFT}
				assignment={assignment}
				assignmentRef={assignmentRef}
			/>
		);

		expect(container.querySelector('.draft-label')?.textContent).toEqual(
			'Currently not visible to any students'
		);
		expect(container.querySelector('.publish-container')).toBe(null);
		expect(container.querySelector('.schedule-container')).toBe(null);

		expect(container.querySelector('.date-editor')).toBe(null);
	});
});
