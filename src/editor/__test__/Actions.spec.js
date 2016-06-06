import {saveFieldOn} from '../Actions';

describe('Assignment Editor Action Tests', () => {
	describe('Saving Field Tests', () => {
		let assignment;

		beforeEach(() => {
			assignment = {
				value: 'old',
				save: () => {
					return Promise.resolve();
				}
			};

			spyOn(assignment, 'save').and.callThrough();
		});


		it ('Saving the same value does NOT call save', () => {
			saveFieldOn(assignment, 'value', 'old');

			expect(assignment.save).not.toHaveBeenCalled();
		});


		it ('Saving a new value does call save', () => {
			saveFieldOn(assignment, 'value', 'new');

			expect(assignment.save).toHaveBeenCalled();
		});
	});
});
