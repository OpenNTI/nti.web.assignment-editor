import './DueDate.scss';
import React from 'react';
import PropTypes from 'prop-types';
import { scoped } from '@nti/lib-locale';
import { Checkbox } from '@nti/web-commons';

import DateEditor from './DateEditor';

const DEFAULT_TEXT = {
	dueDate: 'Due Date',
};
const t = scoped(
	'course.overview.lesson.items.questionset.editor.DueDate',
	DEFAULT_TEXT
);

export default class AssignmentEditorDueDate extends React.Component {
	static propTypes = {
		onDueDateChecked: PropTypes.func,
		onDateChanged: PropTypes.func,
		date: PropTypes.object,
		dueDateChecked: PropTypes.bool,
	};

	state = {};

	constructor(props) {
		super(props);
	}

	onDueDateChange = e => {
		const { onDueDateChecked } = this.props;

		if (onDueDateChecked) {
			onDueDateChecked(e.target.checked);
		}
	};

	onChange = val => {
		const { onDateChanged } = this.props;

		if (onDateChanged) {
			onDateChanged(val);
		}
	};

	render() {
		const selected = this.props.dueDateChecked;

		return (
			<div className="inline-due-date-editor">
				<div className="label">
					<div className="nti-checkbox-input">
						<Checkbox
							label={t('dueDate')}
							onChange={this.onDueDateChange}
							checked={selected}
						/>
						<DateEditor
							disabled={!selected}
							date={this.props.date}
							onDateChanged={this.onChange}
						/>
					</div>
				</div>
			</div>
		);
	}
}
