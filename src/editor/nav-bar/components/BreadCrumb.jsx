import './BreadCrumb.scss';
import React from 'react';
import PropTypes from 'prop-types';

import { scoped } from '@nti/lib-locale';

const defaultText = {
	root: 'Assignments',
};

const t = scoped('assignment.editing.breadcrumb', defaultText);

export default class AssignmentEditorBreadCrumb extends React.Component {
	static propTypes = {
		gotoRoot: PropTypes.func,
	};

	onRootClick = () => {
		const { gotoRoot } = this.props;

		if (gotoRoot) {
			gotoRoot();
		}
	};

	render() {
		const { gotoRoot } = this.props;

		return (
			<div className="assignment-editor-breadcrumb">
				{gotoRoot && (
					<span className="root" onClick={this.onRootClick}>
						{t('root')}
					</span>
				)}
			</div>
		);
	}
}
