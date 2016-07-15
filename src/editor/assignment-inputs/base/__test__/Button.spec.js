import React from 'react';
import ReactDOM from 'react-dom';
import Button from '../Button';

const render = (node, cmp, props, ...children) => new Promise(next =>
	void ReactDOM.render(
		React.createElement(cmp, {...props, ref (x) {cmp = x; props.ref && props.ref(x);}}, ...children),
		node,
		() => next(cmp)
	));

describe('Assignment Sidebar Button Tests', ()=> {
	let container = document.createElement('div');
	let newNode;
	const assignment = {
		'Class':'Assignment',
		'CategoryName':'homework',
		'MimeType':'application/vnd.nextthought.assessment.assignment',
		'NoSubmit':false,
		'content':'This is a description of an <b>assignment.</b>',
		'parts':[
			{
				'Class':'AssignmentPart',
				'MimeType':'application/vnd.nextthought.assessment.assignmentpart',
				'question_set':{
					'Class':'QuestionSet',
					'MimeType':'application/vnd.nextthought.naquestionset',
					'questions':[{
						'Class':'Question',
						'MimeType':'application/vnd.nextthought.naquestion',
						'parts':[{
							'Class':'MultipleChoicePart',
							'MimeType':'application/vnd.nextthought.assessment.randomizedmultiplechoicepart',
							'solutions':[{
								'Class':'MultipleChoiceSolution',
								'MimeType':'application/vnd.nextthought.assessment.multiplechoicesolution',
								'value':0
							}],
							'choices':[
								'Federal support for rebuilding the southern economy and society',
								'Created new opportunities and protections for freedmen and their citizenship'
							]
						},{
							'Class':'MultipleChoicePart',
							'MimeType':'application/vnd.nextthought.assessment.randomizedmultiplechoicepart',
							'content':'Test Part Content part 2',
							'solutions':[{
								'Class':'MultipleChoiceSolution',
								'MimeType':'application/vnd.nextthought.assessment.multiplechoicesolution',
								'value':0
							}],
							'choices':[
								'Affirmation of the \'Lost Cause\' movement',
								'Withdrawal of federal troops from the South'
							]
						}]
					},{
						'Class':'Question',
						'MimeType':'application/vnd.nextthought.naquestion',
						'parts':[{
							'Class':'MultipleChoicePart',
							'MimeType':'application/vnd.nextthought.assessment.randomizedmultiplechoicepart',
							'solutions':[{
								'Class':'MultipleChoiceSolution',
								'MimeType':'application/vnd.nextthought.assessment.multiplechoicesolution',
								'value':0
							}],
							'choices':[
								'The First Reconstruction Acts',
								'The Atlanta Compromise'								]
						}]
					},{
						'Class':'Question',
						'MimeType':'application/vnd.nextthought.naquestion',
						'content':'Which of the following were used by southerners to deprive African Americans of their constitutional rights during the Reconstruction Era? <b class=\'bfseries\'>Select all that apply.</b>',
						'parts':[{
							'Class':'MultipleChoiceMultipleAnswerPart',
							'MimeType':'application/vnd.nextthought.assessment.randomizedmultiplechoicemultipleanswerpart',
							'solutions':[{
								'Class':'MultipleChoiceMultipleAnswerSolution',
								'MimeType':'application/vnd.nextthought.assessment.multiplechoicemultipleanswersolution',
								'value':[
									1,
									2,
									4
								]
							}],
							'choices':[
								'Black Codes',
								'Sharecropping',
								'Fifteenth Amendment',
								'Lynching'
							]}
						]
					},{
						'Class':'Question',
						'MimeType':'application/vnd.nextthought.naquestion',
						'content':'5. Students can mark up images and illustrate concepts to share using the ____________.',
						'parts':[{
							'Class':'ModeledContentPart',
							'MimeType':'application/vnd.nextthought.assessment.modeledcontentpart'
						}]
					}],
					'title':'File Upload'
				},
				'title':'Submission'
			}
		],
		'title':'Test Assignment With All Questions 2'
	};


	document.body.appendChild(container);

	beforeEach(()=> {
		newNode = document.createElement('div');
		document.body.appendChild(newNode);
	});

	afterEach(()=> {
		ReactDOM.unmountComponentAtNode(newNode);
		document.body.removeChild(newNode);
	});

	afterAll(()=> {
		ReactDOM.unmountComponentAtNode(container);
		document.body.removeChild(container);
	});


	const test = (props, ...children) => Promise.all([
		render(newNode, Button, props, ...children),
		render(container, Button, props, ...children)
	]);

	it('tests creation of Button', () => {

		test({assignment: assignment})
			.then(cmps => cmps.forEach(button =>
				expect(button).toBeTruthy()
			));
	});

	it('tests count of mutlichoice questions', () => {
		const handles = ['application/vnd.nextthought.assessment.randomizedmultiplechoicepart'];

		test({assignment: assignment, handles: handles})
			.then(cmps => cmps.forEach(button =>
				expect(button.getUsedCount()).toBe(3)
			));
	});

	it('tests count of essay questions', () => {
		const handles = ['application/vnd.nextthought.assessment.modeledcontentpart'];

		test({assignment: assignment, handles: handles})
			.then(cmps => cmps.forEach(button =>
				expect(button.getUsedCount()).toBe(1)
			));

	});

	it('tests empty blank question', () => {
		const handles = ['application/vnd.nextthought.assessment.modeledcontentpart'];
		test({assignment: assignment, handles: handles})
			.then(cmps => cmps.forEach(button =>
				expect(button.getBlankQuestion()).toBeFalsy()
			));
	});

	it('tests blank question', () => {
		const handles = ['application/vnd.nextthought.assessment.modeledcontentpart'];
		const partMimeType = 'application/vnd.nextthought.assessment.modeledcontentpart';
		const questionMimeType = 'application/vnd.nextthought.naquestion';
		const part = {
			MimeType: partMimeType,
			content: 'Content 1 goes here',
			hints: []
		};

		test({assignment: assignment, handles: handles, part: part})
		.then(cmps => cmps.forEach(button => {
			let question = button.getBlankQuestion();
			expect(question.MimeType).toBe(questionMimeType);
			expect(question.parts.length).toBe(1);
		}));

	});
});
