import React from 'react';
import cx from 'classnames';

const PLACEHOLDER_TEXT = 'Students will write here...';

function placeholder (props) {
	const {singleLine, text} = props;
	const placeholderText = text || PLACEHOLDER_TEXT;
	const cls = cx('assignment-textinput-placeholder', {'single-line': singleLine});

	return (
		<div className={cls}>
			{placeholderText}
		</div>
	);
}

placeholder.propTypes = {
	text: React.PropTypes.string,
	singleLine: React.PropTypes.bool
};

export default placeholder;
