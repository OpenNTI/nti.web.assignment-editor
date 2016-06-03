export const MIME_TYPE = 'application/vnd.nextthought.app.moveinfo';

export default class MoveInfo {
	static MimeType = MIME_TYPE

	constructor (origin) {
		this.originContainer = origin.OriginContainer;
		this.originIndex = origin.OriginIndex;
	}

	get dataTransferKey () {
		return MIME_TYPE;
	}

	get dataForTransfer () {
		return JSON.stringify({
			MimeType: MIME_TYPE,
			OriginContainer: this.originContainer,
			OriginIndex: this.originIndex
		});
	}

	get index () {
		return this.originIndex;
	}

	get container () {
		return this.originContainer;
	}
}
