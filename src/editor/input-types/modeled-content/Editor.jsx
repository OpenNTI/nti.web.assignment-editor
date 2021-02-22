import React from 'react';
import PropTypes from 'prop-types';

import Placeholder from './Placeholder';

export default class EssayEditor extends React.Component {
	static propTypes = {
		part: PropTypes.object.isRequired,
	};

	constructor(props) {
		super(props);

		this.state = {};
	}

	render() {
		return <Placeholder />;
	}
}
