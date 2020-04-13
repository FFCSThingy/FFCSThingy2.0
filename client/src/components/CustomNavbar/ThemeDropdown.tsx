import React, { FC } from "react";
import { NavDropdown, Dropdown } from "react-bootstrap";

import themeList from "../../constants/Themes";

import styles from '../../css/CustomNavbar.module.scss';

import ThemeDropdownProps from "../../models/components/CustomNavbar/ThemeDropdown";

const ThemeDropdown: FC<ThemeDropdownProps> = ({ changeActiveTheme }) => (
	<NavDropdown
		id="ThemeDropdown"
		title="Theme"
		className={styles.navbarDropdown}
		onSelect={changeActiveTheme}
	>
		<Dropdown.Menu className={styles.dropdownMenu}>
			{
				Object.keys(themeList)
					.map((v: string) => (
						<NavDropdown.Item
							eventKey={v}
							key={v}
							className={styles.dropdownItem}
						>
							{themeList[v]}
							<NavDropdown.Divider className={styles.dropdownDivider} />
						</NavDropdown.Item>
					))
			}
		</Dropdown.Menu>
	</NavDropdown>
);

export default ThemeDropdown;