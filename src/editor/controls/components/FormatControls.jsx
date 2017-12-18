import React from 'react';
import PropTypes from 'prop-types';
import {ContextProvider, BoldButton, ItalicButton, UnderlineButton, TypeButton, BLOCKS} from 'nti-web-editor';

const DISABLE_FOR_BLOCKS = {
	[BLOCKS.CODE]: true
};

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

	shouldDisableForState (editorState) {
		if (!editorState) {
			return false;
		}

		const selection = editorState.getSelection();
		const start = selection.getStartKey();
		const end = selection.getEndKey();

		if (start !== end) {
			return false;
		}

		const content = editorState.getCurrentContent();
		const block = content.getBlockForKey(start);

		return block && DISABLE_FOR_BLOCKS[block.getType()];
	}


	render () {
		const {editor} = this.state;

		return (
			<ContextProvider editor={editor}>
				<div className="editor-format-controls">
					<BoldButton shouldDisableForState={this.shouldDisableForState}/>
					<ItalicButton shouldDisableForState={this.shouldDisableForState}/>
					<UnderlineButton shouldDisableForState={this.shouldDisableForState}/>
					<span className="format-divider"/>
					<TypeButton type={BLOCKS.CODE} inlineStyle><div className="icon-code-block"/></TypeButton>
				</div>
			</ContextProvider>
		);
	}
}
