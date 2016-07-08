import React from 'react';

import BreadCrumb from './BreadCrumb';

NavBar.propTypes = {
	gotoRoot: React.PropTypes.func
};

function NavBar (props) {
	const {gotoRoot} = props;

	return (
		<div className="assignment-editor-nav-bar">
			<BreadCrumb gotoRoot={gotoRoot} />
		</div>
	);
}

export default NavBar;
