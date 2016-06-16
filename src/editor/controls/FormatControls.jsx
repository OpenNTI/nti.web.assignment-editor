import React from 'react';
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
		selection: React.PropTypes.any
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
		const {selection:oldSelection} = this.props;

		if (newSelection !== oldSelection) {
			this.setState({
				editor: getEditorForSelection(newSelection)
			});
		}
	}


	render () {
		const {editor} = this.state;

		return (
			<EditorContextProvider editor={editor}>
				<div>
					{editor ? 'Editor' : 'No Editor'}
					<FormatButton format={FormatButton.Formats.BOLD}/>
					<FormatButton format={FormatButton.Formats.ITALIC}/>
					<FormatButton format={FormatButton.Formats.UNDERLINE}/>
				</div>
			</EditorContextProvider>
		);
	}
}
