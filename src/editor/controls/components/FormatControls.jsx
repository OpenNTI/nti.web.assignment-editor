import React from 'react';
import PropTypes from 'prop-types';
import {ContextProvider, BoldButton, ItalicButton, UnderlineButton} from 'nti-web-editor';

function getEditorForSelection (selection) {
	const first = selection && selection[0];
	let value = first && first.value;
	let editor;

	//If there is more than one don't return any editor for now
	if (value && selection.length === 1) {
		editor = value.editor;
	}

	return editor;
}

export default class FormatControls extends React.Component {
	static propTypes = {
		selection: PropTypes.any
	}


	constructor (props) {
		super(props);

		const {selection} = this.props;

		this.state = {
			editor: getEditorForSelection(selection)
		};
	}


	componentWillReceiveProps (nextProps) {
		const {selection:newSelection} = nextProps;
		const {editor:oldEditor} = this.state;
		const newEditor = getEditorForSelection(newSelection);

		if (newEditor !== oldEditor) {
			this.setState({
				editor: newEditor
			});
		}
	}


	render () {
		const {editor} = this.state;

		return (
			<ContextProvider editor={editor}>
				<div className="editor-format-controls">
					<BoldButton />
					<ItalicButton />
					<UnderlineButton />
				</div>
			</ContextProvider>
		);
	}
}
