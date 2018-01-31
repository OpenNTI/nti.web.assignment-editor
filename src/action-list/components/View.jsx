import React from 'react';
import PropTypes from 'prop-types';
import {TransitionGroup, CSSTransition} from 'react-transition-group'
import cx from 'classnames';

import Item from './Item';

export default class ActionStack extends React.Component {
	static propTypes = {
		stack: PropTypes.object.isRequired
	}

	constructor (props) {
		super(props);

		const {stack} = props;

		this.state = {
			items: stack.items
		};
	}


	componentDidUpdate () {
		this.addStackListeners();
	}


	componentDidMount () {
		this.addStackListeners();
	}


	componentWillUnmount () {
		this.removeStackListeners();
	}


	addStackListeners () {
		this.removeStackListeners();

		const {stack} = this.props;

		stack.addListener('changed', this.onStackChanged);
	}


	removeStackListeners () {
		const {stack} = this.props;

		stack.removeListener('changed', this.onStackChanged);
	}


	onStackChanged = () => {
		const {stack} = this.props;

		this.setState({
			items: stack.items
		});
	}


	render () {
		const {items} = this.state;
		const cls = cx('action-stack', {'is-empty': !items.length});

		return (
			<div className={cls}>
				<TransitionGroup>
					{items.map(i => (
						<CSSTransition key={item.ID} classNames="fade-in-out" timeout={400}>
							{this.renderItem(item)}
						</CSSTransition>
					))}
				</TransitionGroup>
			</div>
		);
	}


	renderItem (item) {
		return (
			<Item item={item} />
		);
	}
}
