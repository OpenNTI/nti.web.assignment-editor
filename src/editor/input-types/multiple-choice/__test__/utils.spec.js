/* eslint-env jest */
import { partsEqual, generatePartFor } from '../utils';

describe('Multiple Choice actions tests', () => {
	test('Same parts are marked as equal', () => {
		let partA = generatePartFor(
			'mimeType',
			'Content',
			['choice 1', 'choice 2'],
			2,
			[]
		);
		let partB = generatePartFor(
			'mimeType',
			'Content',
			['choice 1', 'choice 2'],
			2,
			[]
		);

		expect(partsEqual(partA, partB)).toBeTruthy();
	});

	test('Different content is marked as not equal', () => {
		let partA = generatePartFor(
			'mimeType',
			'Content 1',
			['choice 1', 'choice 2'],
			2,
			[]
		);
		let partB = generatePartFor(
			'mimeType',
			'Content',
			['choice 1', 'choice 2'],
			2,
			[]
		);

		expect(partsEqual(partA, partB)).toBeFalsy();
	});

	test('Different choices are marked as not equal', () => {
		let partA = generatePartFor(
			'mimeType',
			'Content',
			['choice 1 1', 'choice 2'],
			2,
			[]
		);
		let partB = generatePartFor(
			'mimeType',
			'Content',
			['choice 1', 'choice 2'],
			2,
			[]
		);

		expect(partsEqual(partA, partB)).toBeFalsy();
	});

	test('Different solutions are marked as not equal', () => {
		let partA = generatePartFor(
			'mimeType',
			'Content',
			['choice 1', 'choice 2'],
			2,
			[]
		);
		let partB = generatePartFor(
			'mimeType',
			'Content',
			['choice 1', 'choice 2'],
			3,
			[]
		);

		expect(partsEqual(partA, partB)).toBeFalsy();
	});
});
