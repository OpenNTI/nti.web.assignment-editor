import './View.scss';
import React from 'react';
import PropTypes from 'prop-types';

import { Pager } from '@nti/web-commons';

import BreadCrumb from './BreadCrumb';

NavigationBar.propTypes = {
	gotoRoot: PropTypes.func,
	pageSource: PropTypes.object,
};

export default function NavigationBar(props) {
	const { gotoRoot, pageSource } = props;

	return (
		<div className="assignment-editor-nav-bar">
			<BreadCrumb gotoRoot={gotoRoot} />
			{pageSource && <Pager pageSource={pageSource} />}
		</div>
	);
}
