import uuid from 'node-uuid';

export const MimeType = 'application/vnd.nextthought.app.dndinfo';
const DnDSession = uuid.v4();
const SourceApp = 'application/vnd.nextthought.webapp';
const Version = 1;

//This is constant until the app is restarted/refreshed... fyi
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
