import React, { FC } from 'react';
import { NavDropdown, Dropdown } from 'react-bootstrap';

import styles from '../../css/CustomNavbar.module.scss';

import UserDropdownProps from '../../models/components/CustomNavbar/UserDropdown';

const UserDropdown: FC<UserDropdownProps> = ({ userDetails, doLogout }) => (
	<NavDropdown
		id="UserDropdown"
		alignRight
		title={(
			<img
				className={styles.userProfileImage}
				alt=""
				src={userDetails?.picture}
			/>
		)}
		className={styles.navbarDropdown}
	>
		<Dropdown.Menu className={styles.dropdownMenu}>
			<NavDropdown.Item disabled key="DisplayNameDropdownItem" className={styles.dropdownItem}>
				{userDetails?.display_name}
				<NavDropdown.Divider className={styles.dropdownDivider} />
			</NavDropdown.Item>

			<NavDropdown.Item
				onClick={doLogout}
				className={styles.dropdownItem}
				key="LogoutDropdownItem"
			>
				Logout
				<NavDropdown.Divider className={styles.dropdownDivider} />
			</NavDropdown.Item>
		</Dropdown.Menu>
	</NavDropdown>
);

export default UserDropdown;
