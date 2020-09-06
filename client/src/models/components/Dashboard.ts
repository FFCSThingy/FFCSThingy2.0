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
	setHeatmap: Function;
	setSelectedCurriculum: Function;
	setCurrentCurriculumData: Function;
	selectedCurriculum: string;
}

export interface DashboardContainerProps {
	handleUnauth: Function;
}
