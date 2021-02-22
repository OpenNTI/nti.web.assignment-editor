import './PlaceholderQuestionSet.scss';
import React from 'react';
import { scoped } from '@nti/lib-locale';

import { Placeholder } from '../../question';

const DEFAULT_TEXT = {
	message: 'Switch to Preview Mode to View Content',
};

const t = scoped('assignment.parts.questionset.placeholder', DEFAULT_TEXT);

export default function PlaceholderQuestionSet() {
	return (
		<div className="placeholder-question-set">
			<Placeholder />
			<div className="message">
				<span>{t('message')}</span>
			</div>
		</div>
	);
}
