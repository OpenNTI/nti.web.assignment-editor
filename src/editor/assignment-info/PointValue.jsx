import React from 'react';
import {NumberInput, LabeledValue} from 'nti-web-commons';

export default class PointValue extends React.Component {
	constructor (props) {
		super(props);

		this.state = {};
		this.onBlur = this.onBlur.bind(this);
		this.onChange = this.onChange.bind(this);
		this.save = this.save.bind(this);
		this.setUp = this.setUp.bind(this);
	}

	static propTypes = {
		assignment: React.PropTypes.object.isRequired
	}

	componentWillMount () {
		this.setUp();
	}

	componentWillReceiveProps (nextProps) {
		this.setUp(nextProps);
	}

	setUp (props = this.props) {
		const {assignment} = props;
		const value = assignment.totalPoints;
		this.setState({
			value
		});
	}

	onBlur () {
		this.save();
	}

	onChange (e) {
		this.setState({
			value: e.target.value,
			changed: true
		});
	}

	save () {
		const {assignment} = this.props;
		const {value, changed} = this.state;
		if(changed) {
			assignment.save({
				'total_points': value || 0
			})
			.then(() => {
				this.setState({
					changed: false
				});
			});
		}
	}

	render () {

		const {value} = this.state;

		return (
			<div className="field point-value">
				<LabeledValue label="Value">
					<NumberInput ref={x => this.input = x} onBlur={this.onBlur} onChange={this.onChange} defaultValue={value} />
				</LabeledValue>
			</div>
		);
	}
}
