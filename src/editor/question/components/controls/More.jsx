import React from 'react';

import {Flyout} from 'nti-web-commons';

function renderTrigger () {
	return (
		<span className="more-controls">&middot;&middot;&middot;</span>
	);
}

MoreControls.propTypes = {
	children: React.PropTypes.node
};
export default function MoreControls ({children}) {
	return (
		<Flyout.Triggered className="more-controls-flyout" trigger={renderTrigger()} arrow horizontalAlign={Flyout.ALIGNMENTS.RIGHT} >
			{children}
		</Flyout.Triggered>
	);
}

