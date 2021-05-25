/* eslint-env jest */
import { saveFieldOn } from '../Actions';

describe('Assignment Editor Action Tests', () => {
	describe('Saving Field Tests', () => {
		let assignment;

		beforeEach(() => {
			assignment = {
				value: 'old',
				parent() {},
				save: () => {
					return Promise.resolve();
				},
			};

			jest.spyOn(assignment, 'save');
		});

		test('Saving the same value does NOT call save', () => {
			saveFieldOn(assignment, 'value', 'old');

			expect(assignment.save).not.toHaveBeenCalled();
		});

		test('Saving a new value does call save', () => {
			saveFieldOn(assignment, 'value', 'new');

			expect(assignment.save).toHaveBeenCalled();
		});
	});
});
