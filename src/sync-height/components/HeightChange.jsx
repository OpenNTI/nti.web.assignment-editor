import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import Logger from '@nti/util-logger';
import { wait } from '@nti/lib-commons';

const logger = Logger.get('HeightChange');

const OBSERVER_INIT = {
	childList: true,
	characterData: true,
	subtree: true,
};

function getMutationObserver() {
	return global.MutationObserver || global.WebKitMutationObserver;
}

export default class HeightChange extends React.Component {
	static propTypes = {
		children: PropTypes.node,
		onChange: PropTypes.func,
	};

	constructor(props) {
		super(props);

		const mutationObserver = getMutationObserver();

		this.currentHeight = -1;

		if (mutationObserver) {
			this.observer = new mutationObserver(() => this.maybeChanged());
		} else {
			logger.error(
				'Mutation Observer is not defined, onChange will not be called'
			);
		}
	}

	getDOMNode() {
		//We need the underlying dom node. Using refs will likely give us a Component instance...
		//we don't want to assume the component exposes a ref my any particular name, so,
		//until this API is removed, we will use it.
		// eslint-disable-next-line react/no-find-dom-node
		return ReactDOM.findDOMNode(this);
	}

	maybeChanged() {
		const { onChange } = this.props;
		const node = this.getDOMNode();

		if (!onChange) {
			return;
		}

		wait().then(() => {
			//clientHeight is less expensive to read
			const newHeight = node.clientHeight;

			if (newHeight !== this.currentHeight) {
				this.currentHeight = newHeight;
				onChange();
			}
		});
	}

	componentDidUpdate() {
		this.maybeChanged();
	}

	componentDidMount() {
		const node = this.getDOMNode();

		this.currentHeight = node.clientHeight;

		if (this.observer && node) {
			this.observer.observe(node, OBSERVER_INIT);
		}
	}

	componentWillUnmount() {
		if (this.observer) {
			this.observer.disconnect();
		}
	}

	render() {
		const { children } = this.props;
		const child = React.Children.only(children);

		return child;
	}
}
