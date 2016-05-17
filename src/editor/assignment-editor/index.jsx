import React from 'react';
import cx from 'classnames';

import AssignmentInfo from '../assignment-info';
import AssignmentParts from '../assignment-parts';

export default class AssignmentEditor extends React.Component {
	static propTypes = {
		assignment: React.PropTypes.object,
		schema: React.PropTypes.object
	}


	constructor (props) {
		super(props);

		this.state = {};
	}


	render () {
		const {assignment, schema} = this.props;
		const cls = cx({loading: !!assignment});

		return (
			<div className={cls}>
				<AssignmentInfo assignment={assignment} schema={schema} />
				<AssignmentParts assignment={assignment} schema={schema} />
			</div>
		);
	}
}
