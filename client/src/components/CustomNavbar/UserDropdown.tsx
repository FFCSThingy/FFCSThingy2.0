import React from 'react';
import {
	NavDropdown,
	Dropdown,
	OverlayTrigger,
	Tooltip,
} from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import styles from '../../css/CustomNavbar.module.scss';

import { logout } from '../../reducers/auth';
import { clearLocalData } from '../../reducers/timetable';
import { selectIsAuthenticated } from '../../selectors/auth';
import { selectUserDetails } from '../../selectors/user';

const UserDropdown = () => {
	const dispatch = useDispatch();
	const userDetails = useSelector(selectUserDetails);
	const isAuthenticated = useSelector(selectIsAuthenticated);

	if (!isAuthenticated) {
		return (
			<OverlayTrigger
				key="LoginLink-Overlay"
				placement="left"
				trigger={['hover']}
				overlay={(
					<Tooltip id="CustomNavbar_LoginLinkTooltip">
						Login for cross-device sync and backups on the server
					</Tooltip>
				)}
			>
				<NavDropdown
					id="LoginDropdown"
					alignRight
					title="Login"
					className={styles.navbarDropdown}
				>
					<Dropdown.Menu className={styles.dropdownMenu}>
						<NavDropdown.Item
							as={Link}
							to="/login"
							key="LoginDropdown_KeepLocal"
							className={styles.dropdownItem}
						>
							Keep local data
						</NavDropdown.Item>

						<NavDropdown.Item
							as={Link}
							to="/login"
							key="LoginDropdown_KeepServer"
							className={styles.dropdownItem}
							onClick={() => {
								dispatch(clearLocalData());
							}}
						>
							Keep server data
						</NavDropdown.Item>
					</Dropdown.Menu>
				</NavDropdown>
			</OverlayTrigger>
		);
	}

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
				<NavDropdown.Item
					disabled
					key="DisplayNameDropdownItem"
					className={styles.dropdownItem}
				>
					{userDetails?.display_name}

					<NavDropdown.Divider
						className={styles.dropdownDivider}
					/>
				</NavDropdown.Item>

				<NavDropdown.Item
					onClick={() => {
						dispatch(logout());
						dispatch(clearLocalData());
					}}
					className={styles.dropdownItem}
					key="LogoutDropdownItem"
				>
				Logout
					<NavDropdown.Divider
						className={styles.dropdownDivider}
					/>
				</NavDropdown.Item>
			</Dropdown.Menu>
		</NavDropdown>
	);
};

export default UserDropdown;
