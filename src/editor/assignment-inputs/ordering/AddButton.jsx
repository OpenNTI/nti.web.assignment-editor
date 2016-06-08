import React from 'react';

function addButton (props) {
	const {onAdd} = props;

	return (
		<div className="add-ordering-row" onClick={onAdd}>
			<span>Add a Row</span>
		</div>
	);
}

addButton.propTypes = {
	onAdd: React.PropTypes.func.isRequired
};

export default addButton;
