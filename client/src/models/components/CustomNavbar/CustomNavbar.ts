import UserDetails from '../../data/UserDetails';

export default interface CustomNavbarProps {
	curriculumList: string[];
	selectedCurriculum: string;
	creditCount: number;
	userDetails: UserDetails;
	handleCurriculumChange: Function;
	doLogout: React.MouseEventHandler<this>;
}
export interface CustomNavbarContainerProps {
	curriculumList: string[];
	selectedCurriculum: string;
	userDetails: UserDetails;
	handleCurriculumChange: Function;
	doLogout: React.MouseEventHandler<this>;
}
