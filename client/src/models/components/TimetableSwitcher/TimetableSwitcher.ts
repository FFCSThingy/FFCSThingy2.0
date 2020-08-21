import { SelectCallback } from 'react-bootstrap/helpers';

export default interface TimetableSwitcherProps {
	timetableNames: string[];
	activeTimetableName: string;
	setActiveTimetableName: SelectCallback;
	doNew: Function;
	doEdit: Function;
	doDelete: Function;
	doCopy: Function;
}
