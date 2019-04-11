import React from 'react';
import PropTypes from 'prop-types';
import {scoped} from '@nti/lib-locale';
import {Input, LabeledValue, HOC, Prompt} from '@nti/web-commons';

import {rel} from './PassingScore';

const t = scoped('assignment-editor.editor.info.components.PointValue', {
	removePrompt: 'Removing total points will also remove the current passing score.'
});

export default class PointValue extends React.Component {

	static propTypes = {
		assignment: PropTypes.object.isRequired
	}

	state = {}

	componentDidMount () {
		this.setUp();
	}

	componentDidUpdate (prevProps, prevState) {
		const {assignment} = this.props;
		let {value} = this.state;

		if (prevProps.assignment !== assignment) {
			value = this.setUp();
		}

		if (value !== prevState.value) {
			clearTimeout(this.saveChangeDelay);
			this.saveChangeDelay = setTimeout(this.save, 1500);
		}
	}

	setUp (props = this.props) {
		const {assignment: {totalPoints: value}} = props;

		this.setState({
			value
		});

		return value;
	}

	attachRef = x => this.input = x

	onBlur = () => {
		clearTimeout(this.saveChangeDelay);
		this.save();
	}

	onChange = (value) => {
		//we set the min to 0, but just safe-guard it just in case.
		if (value < 0 || isNaN(value)) {
			return;
		} else if (value === 0) {
			value = null;
		}

		this.setState({
			value: typeof value === 'number' ? value : null
		});
	}

	save = () => {
		const {assignment} = this.props;
		const {value} = this.state;

		if(this.prompting) {
			return;
		}

		if(!value && assignment.passingScore) {
			this.prompting = true;


			// we have a passing score and are trying to clear out total points, so we need to prompt the user to let
			// them know that, by doing so, we will also clear the passing score value as well
			Prompt.areYouSure(t('removePrompt')).then(() => {
				this.prompting = false;

				assignment.save({
					'completion_passing_percent': null,
					'total_points': null
				},
				void 0,
				rel);
			}).catch((e) => {
				this.prompting = false;

				this.setState({value: assignment.totalPoints});
			});
		}
		else {
			// don't need to worry about passingScore here, so just save the total points value
			const doneSaving = () => {
				delete this.savingValue;

				this.setUp();
			};


			if (assignment.totalPoints !== value && this.savingValue !== value) {
				this.savingValue = value;

				assignment.setTotalPoints(value)
					.then(doneSaving, doneSaving);
			}
		}
	}

	onAssignmentChanged = () => {
		this.setUp();
	}

	render () {
		const {assignment} = this.props;
		const {value} = this.state;

		return (
			<div className="field point-value">
				<HOC.ItemChanges item={assignment} onItemChanged={this.onAssignmentChanged}>
					<LabeledValue label="Value" disabled={!assignment.canSetTotalPoints()}>
						<Input.Number
							value={typeof value === 'number' ? value : null}
							min={0}
							ref={this.attachRef}
							onBlur={this.onBlur}
							onChange={this.onChange}
						/>
					</LabeledValue>
				</HOC.ItemChanges>
			</div>
		);
	}
}
