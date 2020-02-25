import {v4 as uuid} from 'uuid';

export const MimeType = 'application/vnd.nextthought.app.dndinfo';
const DnDSession = uuid();
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
