import React from 'react';
import cx from 'classnames';

const SCROLL_STOP_TIMEOUT = 500;

export default class FixedEelement extends React.Component {
	static propTypes = {
		children: React.PropTypes.any,
		className: React.PropTypes.string
	}


	constructor (props) {
		super(props);

		this.setCmpRef = x => this.cmpRef = x;

		this.state = {
			styles: {
				transform: 'none'
			}
		};
	}


	componentDidMount () {
		window.addEventListener('scroll', this.onWindowScroll);
	}


	componentWillUnmount () {
		window.removeEventListener('scroll', this.onWindowScroll);
	}


	startScrollStopTimer () {
		if (this.scrollStopTimeout) {
			clearTimeout(this.scrollStopTimeout);
		}

		this.scrollStopTimeout = setTimeout(() => this.onScrollStop(), SCROLL_STOP_TIMEOUT);
	}


	onWindowScroll = () => {
		const rect = this.cmpRef && this.cmpRef.getBoundingClientRect();
		const {isFixed} = this;

		this.startScrollStopTimer();

		if (rect && !isFixed) {
			this.isFixed = true;

			this.setState({
				styles: {
					position: 'fixed',
					top: `${Math.round(rect.top)}px`,
					left: `${Math.round(rect.left)}px`,
					width: `${rect.width}px`
				}
			});
		}
	}


	onScrollStop () {
		const top = window.scrollY;

		delete this.isFixed;

		this.setState({
			styles: {
				transform: `translate3d(0, ${Math.round(top)}px, 0)`
			}
		});
	}


	render () {
		const {className, children} = this.props;
		const {styles} = this.state;
		const cls = cx(className, 'fixed-element');

		return (
			<div className={cls} style={styles} ref={this.setCmpRef}>
				{children}
			</div>
		);
	}
}
