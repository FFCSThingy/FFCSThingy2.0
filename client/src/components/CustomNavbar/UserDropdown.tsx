import React from 'react';
import { NavDropdown, Dropdown } from 'react-bootstrap';
import { connect, ConnectedProps } from 'react-redux';

import styles from '../../css/CustomNavbar.module.scss';

import UserDropdownProps from '../../models/components/CustomNavbar/UserDropdown';
import StateModel from '../../models/state/State';

const mapStateToProps = (state: StateModel, ownProps: UserDropdownProps) => ({
	userDetails: state.user.details,
	ownProps,
});
const mapDispatch = {};

const connector = connect(mapStateToProps, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

const UserDropdown = (props: PropsFromRedux) => (
	<NavDropdown
		id="UserDropdown"
		alignRight
		title={(
			<img
				className={styles.userProfileImage}
				alt=""
				src={props.userDetails?.picture}
			/>
		)}
		className={styles.navbarDropdown}
	>
		<Dropdown.Menu className={styles.dropdownMenu}>
			<NavDropdown.Item disabled key="DisplayNameDropdownItem" className={styles.dropdownItem}>
				{props.userDetails?.display_name}
				<NavDropdown.Divider className={styles.dropdownDivider} />
			</NavDropdown.Item>

			<NavDropdown.Item
				onClick={props.ownProps.doLogout}
				className={styles.dropdownItem}
				key="LogoutDropdownItem"
			>
				Logout
				<NavDropdown.Divider className={styles.dropdownDivider} />
			</NavDropdown.Item>
		</Dropdown.Menu>
	</NavDropdown>
);

export default connector(UserDropdown);
