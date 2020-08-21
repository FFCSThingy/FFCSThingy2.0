import UserDetails from '../../data/UserDetails';

export default interface CustomNavbarProps {
	curriculumList: string[];
	selectedCurriculum: string;
	creditCount: number;
	userDetails: UserDetails;
	handleCurriculumChange: Function;
	doLogout: React.MouseEventHandler<this>;
};