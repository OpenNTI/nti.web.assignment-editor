import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import {Editor, ContextProvider, Plugins, Parsers, generateID, STYLES, BLOCKS} from '@nti/web-editor';
import {buffer} from '@nti/lib-commons';

const DEFAULT_BUFFER = 5000;

const Types = {
	PLAINTEXT: 'plaintext',
	HTML: 'html'
};

const {ErrorMessage, WarningMessage} = Plugins.Messages.components;
const {CharacterCounter} = Plugins.Counter.components;

function getValue (editorState, type) {
	const parser = type === Types.PLAINTEXT ? Parsers.PlainText : Parsers.HTML;
	const value = editorState && parser.fromDraftState(editorState);

	return value ? value.join('\n') : '';
}

export default class BufferedTextEditor extends React.Component {
	static propTypes = {
		className: PropTypes.string,
		initialValue: PropTypes.string,
		buffer: PropTypes.number,

		onChange: PropTypes.func,
		onEditorChange: PropTypes.func,
		onBlur: PropTypes.func,
		onFocus: PropTypes.func,

		customKeyBindings: PropTypes.object,

		charLimit: PropTypes.number,
		countDown: PropTypes.bool,
		plainText: PropTypes.bool,
		singleLine: PropTypes.bool,
		linkify: PropTypes.bool,
		inlineOnly: PropTypes.bool,
		externalLinks: PropTypes.bool,

		error: PropTypes.object,
		warning: PropTypes.object
	}

	static defaultProps = {
		buffer: DEFAULT_BUFFER,
		linkify: true
	}


	attachEditorRef = x => this.editor = x


	constructor (props) {
		super(props);

		const {initialValue, buffer:bufferTime} = props;

		this.editorID = generateID();

		this.pendingSaves = [];

		this.bufferedChange = buffer(bufferTime, () => this.onChange());

		this.state = {
			editorState: Parsers.HTML.toDraftState(initialValue),
			plugins: this.getPluginsFor(props)
		};
	}


	isPendingSave (value) {
		for (let save of this.pendingSaves) {
			if (save === value) {
				return true;
			}
		}

		return false;
	}


	pushPendingSave (value) {
		this.pendingSaves.push(value);
	}

	cleanupPendingSave (value) {
		this.pendingSaves = this.pendingSaves.filter(save => save !== value);
	}


	componentWillUnmount () {
		this.bufferedChange && this.bufferedChange.cancel();
		this.bufferedChange = () => {};
	}


	componentDidUpdate (prevProps) {
		const diff = (...x) => x.some(key => prevProps[key] !== this.props[key]);

		const {initialValue:newValue, buffer:newBuffer, onEditorChange} = this.props;
		const {initialValue:oldValue, buffer:oldBuffer} = prevProps;

		let state;

		if (newBuffer !== oldBuffer) {
			this.bufferChange = buffer(newBuffer, () => this.onChange());
		}

		if (diff('charLimit', 'countDown', 'plainText', 'singleLine', 'linkify', 'inlineOnly', 'externalLinks')) {
			state = state || {};
			state.plugins = this.getPluginsFor(this.props);
		}

		if (newValue !== oldValue && !this.isFocused && !this.isPendingSave(newValue)) {
			state = state || {};
			state.editorState = Parsers.HTML.toDraftState(newValue);
		}

		this.cleanupPendingSave(newValue);

		if (state) {
			this.setState(state, () => {
				if (onEditorChange) {
					onEditorChange();
				}
			});
		}
	}


	getPluginsFor (props = this.props) {
		const {charLimit, countDown, plainText, singleLine, linkify, inlineOnly, customKeyBindings} = props;
		let plugins = [];

		if (charLimit != null) {
			plugins.push(Plugins.Counter.create({character: {limit: charLimit, countDown}}));
		}

		if (plainText) {
			plugins.push(Plugins.Plaintext.create());
		} else {
			plugins.push(Plugins.LimitBlockTypes.create({allow: new Set([BLOCKS.UNSTYLED, BLOCKS.CODE])}));
			plugins.push(Plugins.LimitStyles.create({allow: new Set([STYLES.BOLD, STYLES.ITALIC, STYLES.UNDERLINE])}));
			plugins.push(Plugins.EnsureFocusableBlock.create());
		}

		if (customKeyBindings) {
			plugins.push(Plugins.CustomKeyBindings.create(customKeyBindings));
		}

		if (singleLine) {
			plugins.push(Plugins.SingleLine.create());
		}

		if (linkify) {
			plugins.push(Plugins.ExternalLinks.create({
				allow: new Set([BLOCKS.UNSTYLED]),
				onStartEdit: () => this.onStartLinkEdit(),
				onStopEdit: () => this.onStopLinkEdit()
			}));
		}

		// if (linkify) {
		// 	plugins.push(Plugins.InlineLinks.create());
		// }

		if (inlineOnly) {
			plugins.push(Plugins.LimitBlockTypes.create({allow: new Set([BLOCKS.UNSTYLED])}));
		}


		return plugins;
	}


	focus () {
		if (this.editor && this.editor.focus && !this.editingLink) {
			this.editor.focus();
		}
	}


	focusToEnd () {
		if (this.editor && this.editor.focusToEnd) {
			this.editor.focusToEnd();
		}
	}


	getValue () {
		const state = this.editor && this.editor.getEditorState();

		return getValue(state, this.props.plainText ? Types.PLAINTEXT : Types.HTML);
	}


	getValueFromState () {
		const {editorState} = this.state;

		return getValue(editorState, this.props.plainText ? Types.PLAINTEXT : Types.HTML);
	}


	hasValueChanged () {
		return this.getValue() !== this.getValueFromState();
	}


	onChange = () => {
		const {onChange} = this.props;
		const newValue = this.getValue();

		if (onChange && this.hasValueChanged()) {
			this.pushPendingSave(newValue);
			onChange(newValue);
		}
	}


	onStartLinkEdit () {
		this.editingLink = true;
		clearTimeout(this.onBlurTimeout);
	}


	onStopLinkEdit () {
		this.editingLink = false;
		this.bufferedChange();
	}


	onEditorChange = () => {
		const {onEditorChange} = this.props;

		if (onEditorChange && this.hasValueChanged()) {
			onEditorChange();
		}
	}


	onContentChange = () => {
		const {onEditorChange, error, warning} = this.props;

		if (this.hasValueChanged()) {
			if (onEditorChange) {
				onEditorChange();
			}

			this.bufferedChange();

			if (error && error.clear) {
				error.clear();

				this.bufferedChange.flush();
			} else if (warning && warning.clear) {
				warning.clear();

				this.bufferedChange.flush();
			}
		}
	}


	onEditorFocus = (editor) => {
		const {onFocus} = this.props;

		this.isFocused = true;

		if (onFocus) {
			onFocus(editor);
		}
	}


	onEditorBlur = (editor) => {
		if (this.editingLink) { return; }

		this.onBlurTimeout = setTimeout(() => {
			const {onBlur} = this.props;

			this.isFocused = null;

			this.bufferedChange();
			this.bufferedChange.flush();

			if (onBlur) {
				onBlur(editor);
			}
		}, 100);
	}


	render () {
		const {className, charLimit, error, warning, ...otherProps} = this.props;
		const {editorState, plugins} = this.state;
		const counter = charLimit != null;

		delete otherProps.initialValue;
		delete otherProps.buffer;
		delete otherProps.onChange;
		delete otherProps.onEditorChange;
		delete otherProps.onBlur;
		delete otherProps.onFocus;
		delete otherProps.countDown;
		delete otherProps.plainText;
		delete otherProps.singleLine;
		delete otherProps.linkify;
		delete otherProps.inlineOnly;

		return (
			<div className={cx('text-editor', 'nti-buffered-text-editor', className)}>
				<Editor
					{...otherProps}
					ref={this.attachEditorRef}
					id={this.editorID}
					editorState={editorState}
					plugins={plugins}
					onContentChange={this.onContentChange}
					onChange={this.onEditorChange}
					onBlur={this.onEditorBlur}
					onFocus={this.onEditorFocus}
				/>
				<ContextProvider editorID={this.editorID}>
					<div>
						{counter && (<CharacterCounter className="character-count" />)}
						{error && (<ErrorMessage error={error} />)}
						{warning && (<WarningMessage warning={warning} />)}
					</div>
				</ContextProvider>
			</div>
		);
	}
}
