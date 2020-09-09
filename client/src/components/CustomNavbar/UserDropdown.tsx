import React from 'react';
import { NavDropdown, Dropdown } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';

import styles from '../../css/CustomNavbar.module.scss';

import { RootState } from '../../app/rootReducer';
import { logout } from '../../reducers/auth';

const UserDropdown = () => {
	const dispatch = useDispatch();
	const userDetails = useSelector(
		(state: RootState) => state.user.details,
	);

	return (
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
					onClick={() => dispatch(logout())}
					className={styles.dropdownItem}
					key="LogoutDropdownItem"
				>
				Logout
					<NavDropdown.Divider className={styles.dropdownDivider} />
				</NavDropdown.Item>
			</Dropdown.Menu>
		</NavDropdown>
	);
};

export default UserDropdown;
