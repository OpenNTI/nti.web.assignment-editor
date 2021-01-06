import PropTypes from 'prop-types';
import React, {useCallback} from 'react';
import {scoped} from '@nti/lib-locale';
import {Associations} from '@nti/web-commons';

const Box = styled.div`
	font: normal 400 0.875rem/1.25rem var(--body-font-family);
	color: var(--primary-grey);
	cursor: pointer;
`;

const {createInterfaceForItem, openEditorModal} = Associations;

const AssignmentType = 'application/vnd.nextthought.assessment.assignment';

const DEFAULT_TEXT = {
	shareWith: 'Share with Other Assignments',
	modalLabel: 'Add to Assignment',
	noActiveLessons: 'Add to Assignment',
	availableLabel: 'Available Assignments',
	noShared: {
		subHeader: 'Add to a Assignment.'
	}
};

const t = scoped('assignment.editing.controls.question-sharing', DEFAULT_TEXT);

ShareControl.propTypes = {
	question: PropTypes.object.isRequired,
	course: PropTypes.object.isRequired
};

function ShareControl ({question, course}, ref) {

	const onClick = useCallback(() => {
		const associations = createInterfaceForItem(question, course, [AssignmentType]);
		openEditorModal(t('modalLabel'), associations, null, t);
	}, [question, course]);



	return (
		<Box ref={ref} className="share-control-list-item" onClick={onClick}>
			{t('shareWith')}
		</Box>
	);
}

export default React.forwardRef(ShareControl);
