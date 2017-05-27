import React from 'react';
import PropTypes from 'prop-types';
import {EditorContextProvider, FormatButton} from 'nti-modeled-content';

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
			<EditorContextProvider editor={editor}>
				<div className="editor-format-controls">
					<FormatButton format={FormatButton.Formats.BOLD}/>
					<FormatButton format={FormatButton.Formats.ITALIC}/>
					<FormatButton format={FormatButton.Formats.UNDERLINE}/>
				</div>
			</EditorContextProvider>
		);
	}
}
