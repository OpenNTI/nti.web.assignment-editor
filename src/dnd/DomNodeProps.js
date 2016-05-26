const DRAGGABLE = 'draggable';
const DROPZONE = 'dropzone';

const WHITE_LIST = {};

WHITE_LIST[DRAGGABLE] = [
	'onDragStart',
	'onDragEnd'
];

WHITE_LIST[DROPZONE] = [
	'onDragEnter',
	'onDragLeave',
	'onDragOver',
	'onDrop'
];

export function getDomNodeProps (props, limitTo) {
	limitTo = limitTo || Object.keys(WHITE_LIST);

	if (!Array.isArray(limitTo)) {
		limitTo = [limitTo];
	}

	return limitTo.reduce((acc, propType) => {
		WHITE_LIST[propType].reduce((ac, propName) => {
			if (props[propName] !== undefined) {
				acc[propName] = props[propName];
			}

			return ac;
		}, acc);

		return acc;
	}, {});
}

export {
	DRAGGABLE,
	DROPZONE
};
