import React from 'react';
import ReactDOM from 'react-dom';
import Logger from 'nti-util-logger';
import wait from 'nti-commons/lib/wait';

const logger = Logger.get('HeightChange');

const OBSERVER_INIT = {
	childList: true,
	characterData: true,
	subtree: true
};

function getMutationObserver () {
	return window.MutationObserver || window.WebKitMutationObserver;
}

export default class HeightChange extends React.Component {
	static propTypes = {
		children: React.PropTypes.node,
		onChange: React.PropTypes.func
	}


	constructor (props) {
		super(props);

		const mutationObserver = getMutationObserver();

		this.currentHeight = -1;

		if (mutationObserver) {
			this.observer = new mutationObserver ( () => this.maybeChanged());
		} else {
			logger.error('Mutation Observer is not defined, onChange will not be called');
		}
	}


	getDOMNode () {
		return ReactDOM.findDOMNode(this);
	}


	maybeChanged () {
		const {onChange} = this.props;
		const node = this.getDOMNode();

		if (!onChange) { return; }

		wait()
			.then(() => {
				//clientHeight is less expensive to read
				const newHeight = node.clientHeight;

				if (newHeight !== this.currentHeight) {
					this.currentHeight = newHeight;
					onChange();
				}
			});
	}


	componentDidUpdate () {
		this.maybeChanged();
	}


	componentDidMount () {
		const node = this.getDOMNode();

		this.currentHeight = node.clientHeight;

		if (this.observer && node) {
			this.observer.observe(node, OBSERVER_INIT);
		}
	}


	componentWillUnmount () {
		if (this.observer) {
			this.observer.disconnect();
		}
	}


	render () {
		const {children} = this.props;
		const child = React.Children.only(children);

		return child;
	}
}