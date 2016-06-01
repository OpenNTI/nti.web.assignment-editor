import React from 'react';

import Selectable from '../utils/Selectable';
import {saveDescription} from './Actions';

const PLACEHOLDER = 'Write a description...';

export default class TitleEditor extends React.Component {
	static propTypes = {
		assignment: React.PropTypes.object.isRequired,
		schema: React.PropTypes.object
	}

	constructor (props) {
		super(props);

		const {assignment} = props;

		this.state = {
			selectableId: assignment.NTIID + '-description',
			selectableValue: 'Description',
			value: assignment.content
		};

		this.onBlur = this.onBlur.bind(this);
		this.onChange = this.onChange.bind(this);
		this.onInputFocus = this.onInputFocus.bind(this);
		this.onInputBlur = this.onInputBlur.bind(this);
	}


	onBlur () {
		const {assignment} = this.props;
		const {value} = this.state;

		saveDescription(assignment, value);
	}


	onChange (e) {
		this.setState({
			value: e.target.value
		});
	}


	onInputFocus () {
		this.setState({
			selectableValue: 'Description FOCUSED'
		});
	}


	onInputBlur () {
		this.setState({
			selectableValue: 'Description'
		});
	}


	render () {
		const {selectableId, selectableValue, value} = this.state;

		return (
			<Selectable className="assignment-description-editor" id={selectableId} value={selectableValue} onUnselect={this.onBlur}>
				<textarea placeholder={PLACEHOLDER} value={value} onChange={this.onChange} onFocus={this.onInputFocus} onBlur={this.onInputBlur}>
				</textarea>
			</Selectable>
		);
	}
}
