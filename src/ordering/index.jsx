import React from 'react';
import Ordering from './Ordering';
import Draggable from '../dnd/Draggable';

export default class Test extends React.Component {
	constructor (props) {
		super(props);

		const MimeType = 'application/vnd.nextthought.test';

		this.renderItem = this.renderItem.bind(this);
		this.onChange = this.onChange.bind(this);

		this.state = {
			items: [
				{MimeType, NTIID: '1', label: 'Choice 1'},
				{MimeType, NTIID: '2', label: 'Choice 2'},
				{MimeType, NTIID: '3', label: 'Choice 3'},
				{MimeType, NTIID: '4', label: 'Choice 4'},
				{MimeType, NTIID: '5', label: 'Choice 5'},
				{MimeType, NTIID: '6', label: 'Choice 6'},
				{MimeType, NTIID: '7', label: 'Choice 7'},
				{MimeType, NTIID: '8', label: 'Choice 8'},
				{MimeType, NTIID: '9', label: 'Choice 9'},
				{MimeType, NTIID: '10', label: 'Choice 10'}
			]
		};
	}


	onChange (newOrder) {
		debugger;
	}


	render () {
		const {items} = this.state;

		return (
			<Ordering items={items} renderItem={this.renderItem} accepts={['application/vnd.nextthought.test']} onChange={this.onChange} />
		);
	}


	renderItem (item, index) {
		return (
			<div>{item.label}</div>
		);
	}

}
