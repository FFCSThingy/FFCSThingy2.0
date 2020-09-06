export interface AlertRowProps {
	show: boolean;
	setShowAlert: Function;
}

export interface TTErrorProps {
	error: string;
	setTimetableGenerationError: Function;
}

export default interface DashboardProps {
	handleUnauth: Function;
	setCurrentCurriculumData: Function;
}

export interface DashboardContainerProps {
	handleUnauth: Function;
}
