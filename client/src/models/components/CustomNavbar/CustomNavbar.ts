import UserDetails from '../../data/UserDetails';

export default interface CustomNavbarProps {
	curriculumList: string[];
	selectedCurriculum: string;
	activeTheme: string;
	creditCount: number;
	userDetails: UserDetails;
	handleCurriculumChange: Function;
	changeActiveTheme: Function;
	doLogout: React.MouseEventHandler<this>;
};