import uuid from 'node-uuid';

const MimeType = 'application/vnd.nextthought.app.dndinfo';
const DnDSession = uuid.v4();
const SourceApp = 'application/vnd.nextthought.webapp';
const Version = 1;

export default {
	MimeType,
	DnDSession,
	SourceApp,
	Version,

	get dataForTransfer () {
		return JSON.stringify({
			MimeType,
			DnDSession,
			SourceApp,
			Version
		});
	}
};
