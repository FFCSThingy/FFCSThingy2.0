import UserDetails from '../../data/UserDetails';

export default interface CustomNavbarProps {
	creditCount: number;
	userDetails: UserDetails;
	doLogout: React.MouseEventHandler<this>;
}
export interface CustomNavbarContainerProps {
	userDetails: UserDetails;
	doLogout: React.MouseEventHandler<this>;
}
