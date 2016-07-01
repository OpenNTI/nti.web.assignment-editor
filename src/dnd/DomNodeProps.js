export const DRAGGABLE = 'draggable';
export const DROPZONE = 'dropzone';
export const CLASSNAME = 'classname';
export const DATA = 'data';

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

WHITE_LIST[CLASSNAME] = ['className'];

WHITE_LIST[DATA] = (acc, props) => {
	const names = Object.keys(props);
	const regex = /^data/;

	return names.reduce((ac, name) => {
		if (regex.test(name)) {
			ac[name] = props[name];
		}

		return ac;
	}, acc);
};

export function getDomNodeProps (props, limitTo) {
	limitTo = limitTo || Object.keys(WHITE_LIST);

	if (!Array.isArray(limitTo)) {
		limitTo = [limitTo];
	}

	return limitTo.reduce((acc, propType) => {
		const whiteList = WHITE_LIST[propType];

		if (typeof whiteList === 'function') {
			whiteList(acc, props);
		} else {
			whiteList.reduce((ac, propName) => {
				if (props[propName] !== undefined) {
					acc[propName] = props[propName];
				}

				return ac;
			}, acc);
		}

		return acc;
	}, {});
}
