import React from 'react';

import Selectable from '../utils/Selectable';
import {saveTitle} from './Actions';

const PLACEHOLDER = 'Title';

export default class TitleEditor extends React.Component {
	static propTypes = {
		assignment: React.PropTypes.object.isRequired,
		schema: React.PropTypes.object
	}

	constructor (props) {
		super(props);

		const {assignment} = props;

		this.state = {
			selectableId: assignment.NTIID + '-title',
			selectableValue: assignment.title,
			value: assignment.title
		};

		this.onBlur = this.onBlur.bind(this);
		this.onChange = this.onChange.bind(this);
		this.onInputFocus = this.onInputFocus.bind(this);
		this.onInputBlur = this.onInputBlur.bind(this);
	}


	onBlur () {
		const {assignment} = this.props;
		const {value} = this.state;

		saveTitle(assignment, value);
	}


	onChange (e) {
		this.setState({
			value: e.target.value
		});
	}


	onInputFocus () {
		const {assignment} = this.props;

		this.setState({
			selectableValue: assignment.title + ' FOCUSED'
		});
	}


	onInputBlur () {
		const {assignment} = this.props;

		this.setState({
			selectableValue: assignment.title
		});
	}


	render () {
		const {selectableId, selectableValue, value} = this.state;

		return (
			<Selectable className="assignment-title-editor" id={selectableId} value={selectableValue} onUnselect={this.onBlur}>
				<input
					type="text"
					placeholder={PLACEHOLDER}
					value={value}
					onChange={this.onChange}
					onFocus={this.onInputFocus}
					onBlur={this.onInputBlur}
				/>
			</Selectable>
		);
	}
}
