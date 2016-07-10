import {isSameData} from '../DataTransfer';

describe('DataTransfer tests', () => {
	describe('isSameData', () => {
		it('Same data is truthy', () => {
			expect(isSameData({NTIID: 'a'}, {NTIID: 'a'})).toBeTruthy();
			expect(isSameData({ID: 'a'}, {ID: 'a'})).toBeTruthy();
			expect(isSameData('a', 'a')).toBeTruthy();
		});

		it('Different data is falsy', () => {
			expect(isSameData({NTIID: 'a'}, {NTIID: 'b'})).toBeFalsy();
			expect(isSameData({ID: 'a'}, {ID: 'b'})).toBeFalsy();
			expect(isSameData('a', 'b')).toBeFalsy();
		});
	});
});
