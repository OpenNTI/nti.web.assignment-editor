/* eslint-env jest */
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';

import View from '../View';

describe('Assignment editor view test', () => {
	const assignmentRef = {
		NTIID: 'refID',
	};

	test.skip('Test empty assignment', async () => {
		const assignment = {
			hasLink: rel => {
				return rel === 'date-edit-start';
			},
			available_for_submission_beginning: null,
			available_for_submission_ending: null,
			PublicationState: null,
		};

		const { container } = render(
			<View assignment={assignment} assignmentRef={assignmentRef} />
		);

		// draft is selected, there is no reset and due date editor is disabled
		expect(container.querySelector('.draft-container')).toBeTruthy();
		expect(container.querySelector('.inline-reset-menu')).toBe(null);

		const dueDateEditor = container.querySelector(
			'.inline-due-date-editor .date-editor'
		);

		expect(dueDateEditor.classList.contains('disabled')).toBeTruthy();
	});

	test.skip('Test published assignment with due date and reset', async () => {
		const assignment = {
			hasLink: rel => {
				return rel === 'Reset';
			},
			available_for_submission_beginning: new Date().getTime(),
			available_for_submission_ending: new Date().getTime(),
			PublicationState: 'true',
		};

		const { container } = render(
			<View assignment={assignment} assignmentRef={assignmentRef} />
		);

		// no publish options since the assignment has been started and is resettable
		expect(container.querySelector('.publish-container')).toBe(null);
		expect(container.querySelector('.inline-reset-menu')).toBeTruthy();

		expect(
			container.querySelector('.publish-reset-label').textContent
		).toEqual('Students have started your assignment.');
		expect(
			container.querySelector('.publish-reset-text').textContent
		).toEqual(
			'Resetting or deleting this assignment will result in erasing students work and submissions. You cannot undo this action.'
		);
		expect(container.querySelector('.publish-reset')).toBeTruthy();

		const dueDateEditor = container.querySelector(
			'.inline-due-date-editor .date-editor'
		);

		expect(dueDateEditor.classList.contains('disabled')).toBeFalsy();
	});

	test.skip('Test published assignment with due date and non-instructor admin reset', async () => {
		const assignment = {
			hasLink: rel => {
				return rel === '';
			},
			available_for_submission_beginning: new Date().getTime(),
			available_for_submission_ending: new Date().getTime(),
			PublicationState: 'true',
		};

		const { container } = render(
			<View assignment={assignment} assignmentRef={assignmentRef} />
		);

		// no publish options since the assignment has been started and is resettable
		expect(container.querySelector('.publish-container')).toBe(null);
		expect(container.querySelector('.inline-reset-menu')).toBeTruthy();

		expect(
			container.querySelector('.publish-reset-label').textContent
		).toEqual('Students have started this assignment.');
		expect(
			container.querySelector('.publish-reset-text').textContent
		).toEqual(
			'The instructor must reset this assignment before a publish change can occur.'
		);

		// non-instructor admins should not have the reset button
		expect(container.querySelector('.publish-reset')).toBe(null);

		const dueDateEditor = container.querySelector(
			'.inline-due-date-editor .date-editor'
		);

		expect(dueDateEditor.classList.contains('disabled')).toBeFalsy();
	});

	test.skip('Test reset', async () => {
		let didReset = false;
		let didDismiss = false;

		const onDismiss = () => {
			didDismiss = true;
		};

		const assignment = {
			hasLink: rel => {
				return rel === 'Reset';
			},
			postToLink: (rel, data) => {
				if (rel === 'Reset') {
					didReset = true;
				}

				return Promise.resolve({});
			},
			refresh: () => {},
			available_for_submission_beginning: new Date().getTime(),
			available_for_submission_ending: new Date().getTime(),
			PublicationState: 'true',
		};

		const { container } = render(
			<View
				assignment={assignment}
				assignmentRef={assignmentRef}
				onDismiss={onDismiss}
			/>
		);

		fireEvent.click(
			container.querySelector('.inline-reset-menu .publish-reset')
		);

		await waitFor(() => expect(didReset).toBe(true));

		fireEvent.click(container.querySelector('.footer .cancel'));

		await waitFor(() => expect(didDismiss).toBe(true));
	});

	test.skip('Test scheduled assignment with due date', async () => {
		const now = new Date();
		const date = new Date('10/31/2018');
		const nextYear = now.getFullYear() + 1;

		date.setFullYear(nextYear);

		const assignment = {
			hasLink: rel => {
				return rel === 'date-edit-start';
			},
			available_for_submission_beginning: date.getTime(), // publish date should be on year from now
			available_for_submission_ending: null,
			PublicationState: 'true',
		};

		const { container } = render(
			<View assignment={assignment} assignmentRef={assignmentRef} />
		);

		// schedule is selected and the scheduled date widget reflects the provided date
		expect(container.querySelector('.schedule-container')).toBeTruthy();
		expect(container.querySelector('.inline-reset-menu')).toBe(null);

		const scheduleDateEditor = container.querySelector(
			'.schedule-container .date-editor'
		);

		const datePattern = new RegExp('October.*31.*' + nextYear);

		expect(scheduleDateEditor.textContent).toMatch(datePattern);
	});

	test.skip('Test save scheduled', async () => {
		const ref = React.createRef();
		let didPublish = false;
		let startDate = null;
		let endDate = null;

		const assignment = {
			hasLink: rel => {
				return (
					rel === 'date-edit-start' ||
					rel === 'publish' ||
					rel === 'date-edit'
				);
			},
			postToLink: (rel, data) => {
				if (rel === 'publish') {
					didPublish = true;
				}

				return Promise.resolve({});
			},
			putToLink: (rel, data) => {
				startDate = new Date(
					data['available_for_submission_beginning'] * 1000
				);
				endDate = new Date(
					data['available_for_submission_ending'] * 1000
				);

				return Promise.resolve({});
			},
			refresh: () => {},
			available_for_submission_beginning: null,
			available_for_submission_ending: null,
			PublicationState: null,
		};

		const { container } = render(
			<View
				ref={ref}
				assignment={assignment}
				assignmentRef={assignmentRef}
			/>
		);

		const scheduledDate = new Date('10/25/2018');
		const dueDate = new Date('10/31/2018');

		ref.current.setState({
			selectedPublishType: 'schedule',
			scheduledDate,
			dueDateChecked: true,
			dueDate,
		});

		// simulates saving as scheduled, which should invoke a publish call and
		// a put that sets the scheduled date and due dates (since we specified a due date in the state)
		fireEvent.click(container.querySelector('.save'));

		await waitFor(() => {
			expect(didPublish).toBe(true);

			expect(scheduledDate).toEqual(startDate);
			expect(endDate).toEqual(dueDate);
		});
	});

	test.skip('Test save draft', async () => {
		let didUnpublish = false;

		const assignment = {
			hasLink: rel => {
				return (
					rel === 'date-edit-start' ||
					rel === 'publish' ||
					rel === 'date-edit' ||
					rel === 'unpublish'
				);
			},
			postToLink: (rel, data) => {
				if (rel === 'unpublish') {
					didUnpublish = true;
				}

				return Promise.resolve({});
			},
			putToLink: (rel, data) => {
				return Promise.resolve({});
			},
			refresh: () => {},
			available_for_submission_beginning: null,
			available_for_submission_ending: null,
			PublicationState: null,
		};

		const { container } = render(
			<View assignment={assignment} assignmentRef={assignmentRef} />
		);

		// simulates saving as a draft, which should invoke an unpublish call
		fireEvent.click(container.querySelector('.save'));

		await waitFor(() => expect(didUnpublish).toBe(true));
	});
});
