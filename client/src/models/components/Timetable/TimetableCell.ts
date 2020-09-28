export default interface TimetableCellProps {
	isFilled?: boolean;
	isLab?: boolean;
	dayHeader?: boolean;
	timeHeader?: boolean;
	isBreak?: boolean;
	reqdCourse?: {
		title: string;
		faculty: string;
		slot: string;
		code: string;
		venue: string;
		course_type: string;
	};
	defaultValue: string;
	children: React.ReactNode;
}
