import UserDetails from "../../data/UserDetails";

export default interface UserDropdownProps {
	userDetails: UserDetails;
	doLogout: React.MouseEventHandler<this>;
};