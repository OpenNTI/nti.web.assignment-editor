import React from 'react';
import {Pager} from 'nti-web-commons';

import BreadCrumb from './BreadCrumb';

NavBar.propTypes = {
	gotoRoot: React.PropTypes.func,
	pageSource: React.PropTypes.obj
};

function NavBar (props) {
	const {gotoRoot, pageSource} = props;

	return (
		<div className="assignment-editor-nav-bar">
			<BreadCrumb gotoRoot={gotoRoot} />
			{pageSource && <Pager pageSource={pageSource} />}
		</div>
	);
}

export default NavBar;
