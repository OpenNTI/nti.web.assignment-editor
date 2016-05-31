import React from 'react';

import Draggable from './Draggable';
import Dropzone from './Dropzone';
import Ordering from './ordering/Ordering';

export {
	Draggable,
	Dropzone,
	Ordering
};

export default function testDND () {
	const handlers = {
		'application/vnd.nextthought.text': () => {
			debugger;
		}
	};

	return (
		<div>
			<Draggable data={{MimeType: 'application/vnd.nextthought.text', value: 'Test'}}>
				<span>Test Drag</span>
			</Draggable>
			<Dropzone dropHandlers={handlers}>
				<div style={{height: '200px', width: '200px', background: 'red'}}>
					<span>Dropzone</span>
				</div>
			</Dropzone>
		</div>
	);
}
