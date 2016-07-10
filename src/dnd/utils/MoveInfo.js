export const MimeType = 'application/vnd.nextthought.app.moveinfo';

export default class MoveInfo {
	static MimeType = MimeType

	constructor (origin) {
		this.originContainer = origin.OriginContainer;
		this.originIndex = origin.OriginIndex;
	}

	get dataTransferKey () {
		return MimeType;
	}

	get dataForTransfer () {
		return JSON.stringify({
			MimeType: MimeType,
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
