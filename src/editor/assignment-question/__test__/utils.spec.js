import {cloneQuestion, clonePart, cloneSolution} from '../utils';

const CONTENT = 'Question Content';

const SOLUTION = {
	Class: 'MultipleChoiceMultipleAnswerSolution',
	MimeType: 'application/vnd.nextthought.assessment.multiplechoicemultipleanswersolution',
	NTIID: 'tag:nextthought.com,2011-10:system-OID-0x4686e6:5573657273',
	OID: 'tag:nextthought.com,2011-10:system-OID-0x4686e6:5573657273',
	value: [0],
	weight: 1
};

const PART = {
	Class: 'MultipleChoiceMultipleAnswerPart',
	MimeType: 'application/vnd.nextthought.assessment.multiplechoicemultipleanswerpart',
	NTIID: 'tag:nextthought.com,2011-10:NTI-NAQPart-question_andrew_ligon_4743937601983101536_85c88bb1.0',
	OID: 'tag:nextthought.com,2011-10:system-OID-0x4686e5:5573657273',
	choices: ['Choice 1'],
	content: '',
	explanation: '',
	hints: [],
	randomized: false,
	solutions : [SOLUTION],
	weight: 1
};

const QUESTION = {
	Class: 'Question',
	ContainerId: 'tag:nextthought.com,2011-10:NTI-CourseInfo-Summer2015_NTI_1000',
	CreatedTime: 1466463563.247645,
	Creator: 'andrew.ligon',
	ID: 'tag:nextthought.com,2011-10:NTI-NAQ-question_andrew_ligon_4743937601983101536_85c88bb1',
	'Last Modified': 1466463973.795152,
	LimitedEditingCapabilities: false,
	LimitedEditingCapabilitiesSavepoints: false,
	LimitedEditingCapabilitiesSubmissions: false,
	MimeType: 'application/vnd.nextthought.naquestion',
	NTIID: 'tag:nextthought.com,2011-10:NTI-NAQ-question_andrew_ligon_4743937601983101536_85c88bb1',
	OID: 'tag:nextthought.com,2011-10:andrew.ligon-OID-0x4686b8:5573657273:efTWXr7y7sf',
	PublicationState: null,
	containerId: 'tag:nextthought.com,2011-10:NTI-CourseInfo-Summer2015_NTI_1000',
	content: CONTENT,
	href: '/dataserver2/Objects/tag%3Anextthought.com%2C2011-10%3Aandrew.ligon-OID-0x4686b8%3A5573657273%3AefTWXr7y7sf',
	ntiid: 'tag:nextthought.com,2011-10:NTI-NAQ-question_andrew_ligon_4743937601983101536_85c88bb1',
	parts: [PART]
};

describe('Question Editing utils', () => {
	it('Question clone has same values', () => {
		const clone = cloneQuestion(QUESTION);

		expect(clone).not.toEqual(QUESTION);
		expect(clone.PublicationState).toEqual(QUESTION.PublicationState);
		expect(clone.content).toEqual(QUESTION.content);
	});

	it('Part clone has same values', () => {
		const clone = clonePart(PART);

		expect(clone).not.toEqual(PART);
		expect(clone.choices[0]).toEqual(PART.choices[0]);
	});

	it('Solution clone has same values', () => {
		const clone = cloneSolution(SOLUTION);

		expect(clone).not.toEqual(SOLUTION);
		expect(clone.value[0]).toEqual(SOLUTION.value[0]);
	});
});
