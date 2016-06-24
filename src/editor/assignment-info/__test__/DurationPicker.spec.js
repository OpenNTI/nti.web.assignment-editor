import DurationPicker, {secondsPerHour, secondsPerDay} from '../DurationPicker';

describe('DurationPicker Tests', () => {
	const fourDaysThreeHoursTwoMinutesThirtySeconds = (secondsPerDay * 4) + (secondsPerHour * 3) + (120) + 30;
	it('should compute the correct number of days, hours, and minutes', () => {
		expect(DurationPicker.days(fourDaysThreeHoursTwoMinutesThirtySeconds)).toEqual(4);
		expect(DurationPicker.hours(fourDaysThreeHoursTwoMinutesThirtySeconds)).toEqual(3);
		expect(DurationPicker.minutes(fourDaysThreeHoursTwoMinutesThirtySeconds)).toEqual(2);
	});
});
