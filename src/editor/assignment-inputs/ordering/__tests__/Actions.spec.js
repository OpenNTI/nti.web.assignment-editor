import {partsEqual, generatePartFor} from '../Actions';

describe('Ordering Action Tests', () => {
	it('Same parts are marked as equal', () => {
		let partA = generatePartFor('mimeType', 'Content', ['label1', 'label2'], ['value1, value2'], {0: 0, 1: 1}, []);
		let partB = generatePartFor('mimeType', 'Content', ['label1', 'label2'], ['value1, value2'], {0: 0, 1: 1}, []);

		expect(partsEqual(partA, partB)).toBeTruthy();
	});

	it('Different content are marked as NOT equal', () => {
		let partA = generatePartFor('mimeType', 'Content1', ['label1', 'label2'], ['value1, value2'], {0: 0, 1: 1}, []);
		let partB = generatePartFor('mimeType', 'Content2', ['label1', 'label2'], ['value1, value2'], {0: 0, 1: 1}, []);

		expect(partsEqual(partA, partB)).toBeFalsy();
	});

	it('Different labels are marked as NOT equal', () => {
		let partA = generatePartFor('mimeType', 'Content', ['label1', 'label2'], ['value1, value2'], {0: 0, 1: 1}, []);
		let partB = generatePartFor('mimeType', 'Content', ['label1', 'label3'], ['value1, value2'], {0: 0, 1: 1}, []);

		expect(partsEqual(partA, partB)).toBeFalsy();
	});

	it('Different number of labels are marked as NOT equal', () => {
		let partA = generatePartFor('mimeType', 'Content', ['label1', 'label2'], ['value1, value2'], {0: 0, 1: 1}, []);
		let partB = generatePartFor('mimeType', 'Content', ['label1', 'label2', 'label3'], ['value1, value2'], {0: 0, 1: 1}, []);

		expect(partsEqual(partA, partB)).toBeFalsy();
	});

	it('Different values are marked as NOT equal', () => {
		let partA = generatePartFor('mimeType', 'Content', ['label1', 'label2'], ['value1, value2'], {0: 0, 1: 1}, []);
		let partB = generatePartFor('mimeType', 'Content', ['label1', 'label2'], ['value1, value3'], {0: 0, 1: 1}, []);

		expect(partsEqual(partA, partB)).toBeFalsy();
	});

	it('Different number of values are marked as NOT equal', () => {
		let partA = generatePartFor('mimeType', 'Content', ['label1', 'label2'], ['value1, value2'], {0: 0, 1: 1}, []);
		let partB = generatePartFor('mimeType', 'Content', ['label1', 'label2'], ['value1, value2', 'value3'], {0: 0, 1: 1}, []);

		expect(partsEqual(partA, partB)).toBeFalsy();
	});

	it('Different solutions are marked as NOT equal', () => {
		let partA = generatePartFor('mimeType', 'Content', ['label1', 'label2'], ['value1, value2'], {0: 0, 1: 1}, []);
		let partB = generatePartFor('mimeType', 'Content', ['label1', 'label2'], ['value1, value2'], {0: 1, 1: 0}, []);

		expect(partsEqual(partA, partB)).toBeFalsy();
	});

	it('Different number of solutions are marked as NOT equal', () => {
		let partA = generatePartFor('mimeType', 'Content', ['label1', 'label2'], ['value1, value2'], {0: 0, 1: 1}, []);
		let partB = generatePartFor('mimeType', 'Content', ['label1', 'label2'], ['value1, value2'], {0: 0, 1: 1, 2: 2}, []);

		expect(partsEqual(partA, partB)).toBeFalsy();
	});
});
