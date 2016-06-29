import React from 'react';
import Ordering from './Ordering';

export default class Test extends React.Component {
	constructor (props) {
		super(props);

		const MimeType = 'application/vnd.nextthought.test';

		this.renderItem = this.renderItem.bind(this);
		this.onChangeA = this.onChangeA.bind(this);
		this.onChangeB = this.onChangeB.bind(this);

		this.state = {
			itemsA: [
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
			],
			itemsB: [
				{MimeType, NTIID: '11', label: 'Choice 11'},
				{MimeType, NTIID: '12', label: 'Choice 12'},
				{MimeType, NTIID: '13', label: 'Choice 13'},
				{MimeType, NTIID: '14', label: 'Choice 14'},
				{MimeType, NTIID: '15', label: 'Choice 15'},
				{MimeType, NTIID: '16', label: 'Choice 16'},
				{MimeType, NTIID: '17', label: 'Choice 17'},
				{MimeType, NTIID: '18', label: 'Choice 18'},
				{MimeType, NTIID: '19', label: 'Choice 19'},
				{MimeType, NTIID: '20', label: 'Choice 20'}
			]
		};
	}


	onChangeA (newOrder) {
		this.setState({
			itemsA: newOrder
		});
	}


	onChangeB (newOrder) {
		this.setState({
			itemsB: newOrder
		});
	}


	render () {
		const {itemsA, itemsB} = this.state;

		return (
			<div>
				<Ordering containerId="itemsA" items={itemsA} renderItem={this.renderItem} accepts={['application/vnd.nextthought.test']} onChange={this.onChangeA} />
				<div style={{height:'30px'}}></div>
				<Ordering containerId="itemsB" items={itemsB} renderItem={this.renderItem} accepts={['application/vnd.nextthought.test']} onChange={this.onChangeB} />
			</div>
		);
	}


	renderItem (item) {
		return (
			<div>{item.label}</div>
		);
	}

}
