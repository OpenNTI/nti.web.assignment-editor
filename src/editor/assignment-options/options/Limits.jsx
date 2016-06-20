import React, { PropTypes } from 'react';
import {scoped} from 'nti-lib-locale';

import OptionGroup from '../OptionGroup';
import Option from '../Option';

const DEFAULT_TEXT = {
	content: 'Setting a max number of questions will result in unqiue quizzes with randomly chosen questions for every student.',
	labels: {
		all: 'All of the Questions',
		portion: 'Porition of the Questions'
	}
};

const t = scoped('OPTIONS_LIMITS', DEFAULT_TEXT);

export default class Limits extends React.Component {
	static propTypes = {
		assignment: PropTypes.object.isRequired
	}


	onChange = () => {
		// TODO: Hook up Limits API
	}


	render () {
		return (
			<OptionGroup name="limiting" header="Max Limit" content={t('content')}>
				<Option label={t('labels.all')} type="radio" onChange={this.onChange}/>
				<Option label={t('labels.portion')} type="radio" onChange={this.onChange}/>
				<input placeholder="Max set of questions" type="text" className="portion-max-input" />
			</OptionGroup>
		);
	}
}
