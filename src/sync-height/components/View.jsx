import React from 'react';

const SYNC_HEIGHT = Symbol('Sync Height');

export default class SyncHeightView extends React.Component {
	static propTypes = {
		group: React.PropTypes.object.isRequired,
		children: React.PropTypes.any
	}

	setInnerRef = x => this.innerRef = x


	constructor (props) {
		super(props);

		const {group} = this.props;

		this.item = group.getNewItem();

		this.state = {
			height: group.height
		};

		this[SYNC_HEIGHT] = () => {
			const {height:newHeight} = this.props.group;
			const {height:oldHeight} = this.state;

			if (newHeight !== oldHeight) {
				this.setState({
					height: newHeight
				});
			}
		};
	}


	componentWillReceiveProps (nextProps) {
		const {group:newGroup} = nextProps;
		const {group:oldGroup} = this.props;

		if (newGroup !== oldGroup) {
			this.addListeners(newGroup);
			this.item = newGroup.getNewItem();
			this.updateHeight();

			this.setState({
				height: newGroup.height
			});
		}
	}


	updateHeight () {
		const {group} = this.props;
		const height = this.innerRef && this.innerRef.clientHeight;

		if (height != null && group) {
			group.setHeightFor(this.item, height);
		}
	}


	componentDidMount () {
		this.addListeners();
	}


	componentWillUnmount () {
		this.removeListeners();
	}


	addListeners (newGroup) {
		this.removeListeners();

		const {group} = this.props;
		const listenTo = newGroup || group;

		listenTo.addListener('sync-height', this[SYNC_HEIGHT]);
	}


	removeListeners () {
		const {group} = this.props;

		group.removeListener('sync-height', this[SYNC_HEIGHT]);
	}


	render () {
		const {children} = this.props;
		const {height} = this.state;

		//TODO: use the HeightChange HOC to listen for height changes, instead
		//of relying on the parent to call updateHeight
		return (
			<div className="sync-height" style={{minHeight: height + 'px'}}>
				<div ref={this.setInnerRef}>
					{children}
				</div>
			</div>
		);
	}
}
