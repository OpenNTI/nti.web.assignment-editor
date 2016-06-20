import React, { PropTypes } from 'react';
import OptionGroup from '../OptionGroup';
import Option from '../Option';

export default class Limits extends React.Component {
	static propTypes = {
		assignment: PropTypes.object.isRequired
	}


	onChange = () => {

	}


	render () {
		const limitingContent = 'Setting a max number of questions will result in unqiue quizzes with randomly chosen questions for every student';

		return (
			<OptionGroup name="limiting" header="Max Limit" content={limitingContent}>
				<Option label="All of the Questions" type="radio" onChange={this.onChange}/>
				<Option label="Porition of the Questions" type="radio" onChange={this.onChange}/>
				<input placeholder="Max set of questions" type="text" className="porition-max-input" />
			</OptionGroup>
		);
	}
}
