/* eslint-env jest */
import { generatePartFor, partsEqual } from '../utils';

describe('Multiple Choice Multiple Answer test', () => {
	test('Same parts are marked as equal', () => {
		let partA = generatePartFor(
			'mimeType',
			'Content',
			['choice 1', 'choice 2'],
			[2, 1],
			[]
		);
		let partB = generatePartFor(
			'mimeType',
			'Content',
			['choice 1', 'choice 2'],
			[2, 1],
			[]
		);

		expect(partsEqual(partA, partB)).toBeTruthy();
	});

	test('Same solutions in different order are equal', () => {
		let partA = generatePartFor(
			'mimeType',
			'Content',
			['choice 1', 'choice 2'],
			[2, 1],
			[]
		);
		let partB = generatePartFor(
			'mimeType',
			'Content',
			['choice 1', 'choice 2'],
			[1, 2],
			[]
		);

		expect(partsEqual(partA, partB)).toBeTruthy();
	});

	test('Different content is marked as not equal', () => {
		let partA = generatePartFor(
			'mimeType',
			'Content 1',
			['choice 1', 'choice 2'],
			[2, 2],
			[]
		);
		let partB = generatePartFor(
			'mimeType',
			'Content',
			['choice 1', 'choice 2'],
			[2, 2],
			[]
		);

		expect(partsEqual(partA, partB)).toBeFalsy();
	});

	test('Different choices are marked as not equal', () => {
		let partA = generatePartFor(
			'mimeType',
			'Content',
			['choice 1 1', 'choice 2'],
			[2, 2],
			[]
		);
		let partB = generatePartFor(
			'mimeType',
			'Content',
			['choice 1', 'choice 2'],
			[2, 2],
			[]
		);

		expect(partsEqual(partA, partB)).toBeFalsy();
	});

	test('Different solutions are marked as not equal', () => {
		let partA = generatePartFor(
			'mimeType',
			'Content',
			['choice 1', 'choice 2'],
			[2, 1],
			[]
		);
		let partB = generatePartFor(
			'mimeType',
			'Content',
			['choice 1', 'choice 2'],
			[3, 2],
			[]
		);

		expect(partsEqual(partA, partB)).toBeFalsy();
	});
});
