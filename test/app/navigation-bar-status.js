/*eslint no-console: 0*/
// import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';

import {NavigationBar} from '../../src';

const STORAGE_KEY = 'fake_assignment_info';

const getState = () => {
	try {
		const state = JSON.parse(localStorage.getItem(STORAGE_KEY));

		return state || {};
	} catch (e) {
		return {};
	}
};

const setState = (state) => localStorage.setItem(STORAGE_KEY, JSON.stringify(state));

const TODAY = new Date();

const PAST = 'Past';
const FUTURE = 'Future';
const NONE = 'None';

const DATES = {
	[PAST]: new Date((new Date(TODAY)).setDate(TODAY.getDate() - 1)),
	[FUTURE]: new Date((new Date(TODAY)).setDate(TODAY.getDate() + 1)),
	[NONE]: null
};

const SUBMITTED = 'Submitted';
const LATE = 'Late';
const PASSING = 'Passing';
const AUTO_GRADED = 'Auto Graded';
const NO_SUBMIT = 'No Submit';

function buildFakeAssignment (state) {
	return {
		passingScore: state.passingScore ? parseFloat(state.passingScore, 10) : null,
		totalPoints: state.totalPoints ? parseInt(state.totalPoints, 10) : null,

		isTimed: !!state.timeLimit,
		getMaximumTimeAllowed: () => {
			return state.timeLimit ? parseFloat(state.timeLimit, 10) : null;
		},

		getDueDate: () => {
			return state.due ? DATES[state.due] : null;
		},

		submissionBuffer: state.gracePeriod ? parseFloat(state.gracePeriod, 10) : null,

		CompletedItem: state.submitted !== SUBMITTED || !state.passingScore ? null : {
			Success: state.passing === PASSING
		},

		isNonSubmit: () => state.noSubmit === NO_SUBMIT ? true : false,
		canBeSubmitted: () => state.noSubmit === NO_SUBMIT ? false : true
	};
}


function buildFakeHistoryItem (state) {
	if (state.submitted !== SUBMITTED) { return null; }

	const completed = state.late === LATE ?
		new Date((new Date(TODAY)).setDate(TODAY.getDate() + 2)) :
		new Date((new Date(TODAY)).setDate(TODAY.getDate() - 2));

	return {
		Submission: {
			isSubmitted: () => true,
			getCreatedTime: () => completed
		},
		grade: !state.grade ? null : {
			value: state.grade,
			hasAutoGrade: () => state.autoGrade === AUTO_GRADED,
			getValue: () => state.grade
		},
		getGradeValue: () => state.grade,
		isSubmitted: () => true,
		completed,

		getDuration () {
			return state.duration ? (parseFloat(state.duration, 10) * 1000) : null;
		}
	};
}


export default class Test extends React.Component {
	state = getState()

	componentDidUpdate () {
		setState(this.state);
	}

	setPassingScore = (e) => {
		this.setState({
			passingScore: e.target.value
		});
	}


	setTotalPoints = (e) => {
		this.setState({
			totalPoints: e.target.value
		});
	}


	setTimeLimit = (e) => {
		this.setState({
			timeLimit: e.target.value
		});
	}


	onDueChange = (e) => {
		this.setState({
			due: e.target.value
		});
	}


	onGracePeriodChange = (e) => {
		this.setState({
			gracePeriod: e.target.value
		});
	}



	onSubmittedChange = (e) => {
		this.setState({
			submitted: e.target.checked ? e.target.value : false
		});
	}


	onLateChange = (e) => {
		this.setState({
			late: e.target.checked ? e.target.value : false
		});
	}


	onPassingChange = (e) => {
		this.setState({
			passing: e.target.checked ? e.target.value : false
		});
	}

	onGradeChange = (e) => {
		this.setState({
			grade: e.target.value
		});
	}

	onAutoGradeChange = (e) => {
		this.setState({
			autoGrade: e.target.checked ? e.target.value : false
		});
	}


	onNoSubmitChange = (e) => {
		this.setState({
			noSubmit: e.target.checked ? e.target.value : false
		});
	}


	onDurationChange = (e) => {
		this.setState({
			duration: e.target.value
		});
	}


	render () {
		return (
			<div>
				<NavigationBar.Status
					assignment={buildFakeAssignment(this.state)}
					historyItem={buildFakeHistoryItem(this.state)}
				/>
				<div style={{marginTop: '50px'}}>
					<fieldset>
						<legend>Assignment Info</legend>

						<label>
							<span>Passing Score</span>
							<input type="number" onChange={this.setPassingScore} value={this.state.passingScore} max={100} min={0} step={0.05}/>
						</label>
						<br />
						<label>
							<span>Total Points</span>
							<input type="number" onChange={this.setTotalPoints} value={this.state.totalPoints} step={10} />
						</label>
						<br />
						<label>
							<span>Time Limit</span>
							<input type="number" onChange={this.setTimeLimit} value={this.state.timeLimit} step={30000}/>
						</label>
						<br /><br />
						<span>Due Date</span>
						<br />
						<label>
							<span>Past</span>
							<input type="radio" name="assignment-due-date" value={PAST} checked={this.state.due === PAST} onChange={this.onDueChange} />
						</label>
						<label>
							<span>Future</span>
							<input type="radio" name="assignment-due-date" value={FUTURE} checked={this.state.due === FUTURE} onChange={this.onDueChange} />
						</label>
						<label>
							<span>None</span>
							<input type="radio" name="assignment-due-date" value={NONE} checked={this.state.due === NONE} onChange={this.onDueChange} />
						</label>
						<br /><br />
						<label>
							<span>Grace Period (seconds) </span>
							<input type="number" value={this.state.gracePeriod} onChange={this.onGracePeriodChange} step={60}/>
						</label>
						<br />
						<label>
							<span>No Submit</span>
							<input type="checkbox" value={NO_SUBMIT} onChange={this.onNoSubmitChange} checked={this.state.noSubmit === NO_SUBMIT} />
						</label>
					</fieldset>

					<fieldset>
						<legend>Submission Info</legend>

						<label>
							<span>Submitted</span>
							<input type="checkbox" value={SUBMITTED} checked={this.state.submitted === SUBMITTED} onChange={this.onSubmittedChange} />
						</label>
						<br />
						<label>
							<span>Late</span>
							<input type="checkbox" value={LATE} checked={this.state.late === LATE} onChange={this.onLateChange} />
						</label>
						<br />
						<label>
							<span>Passing</span>
							<input type="checkbox" value={PASSING} checked={this.state.passing === PASSING} onChange={this.onPassingChange} />
						</label>
						<br />
						<label>
							<span>Grade</span>
							<input type="text" value={this.state.grade} onChange={this.onGradeChange} />
						</label>
						<br />
						<label>
							<span>Auto Graded</span>
							<input type="checkbox" value={AUTO_GRADED} checked={this.state.autoGrade === AUTO_GRADED} onChange={this.onAutoGradeChange} />
						</label>
						<br />
						<label>
							<span>Duration</span>
							<input type="number" value={this.state.duration} onChange={this.onDurationChange} />
						</label>
					</fieldset>
				</div>
			</div>
		);
	}
}

ReactDOM.render(
	<Test />,
	document.getElementById('content')
);
