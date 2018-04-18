// import React from 'react';
// import PropTypes from 'prop-types';
// import {scoped} from '@nti/lib-locale';
// import {Prompt, Loading, DialogButtons, Panels} from '@nti/web-commons';

// //TODO: add the ability to pick any existing question.
// //For now all the "picker" will do is create new ones.

// const DEFAULT_TEXT = {
// 	title: 'Create a Question',
// 	create: 'Create',
// 	cancel: 'Cancel'
// };

// const t = scoped('assignment-editor.question.creator.View', DEFAULT_TEXT);

// export default class QuestionCreator extends React.Component {
// 	static show (container) {
// 		return new Promise ((fulfill, reject) => {
// 			return Prompt.modal(
// 					(<QuestionCreator container={container} onCreated={fulfill} onCanceled={reject} />),
// 					'question-creator-prompt-container'
// 				);
// 		});
// 	}

// 	static propTypes = {
// 		container: PropTypes.shape({
// 			createQuestion: PropTypes.func.isRequired
// 		}).isRequired,
// 		onCreated: PropTypes.func,
// 		onCanceled: PropTypes.func,
// 		accepts: PropTypes.array
// 	}

// 	render () {

// 	}

// }
