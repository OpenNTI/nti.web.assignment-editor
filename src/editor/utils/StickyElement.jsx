import React from 'react';
import {StickyContainer, Sticky as ReactSticky} from 'react-sticky';

const offsetProp = 'nti-sticky-top-offset';

Sticky.propTypes = {
	children: React.PropTypes.any
};

function Sticky (props) {
	const {children} = props;
	let styles = {};
	let topOffset = 0;

	if (window && window[offsetProp]) {
		topOffset = -window[offsetProp];
		styles.top = window[offsetProp] + 'px';
	}

	return (
		<ReactSticky topOffset={topOffset} stickyStyle={styles}>
			{children}
		</ReactSticky>
	);
}


export {
	StickyContainer,
	Sticky
};
