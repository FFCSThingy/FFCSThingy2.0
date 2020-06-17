import React, { FC } from "react";
import { NavDropdown, Dropdown } from "react-bootstrap";

import themeList from "../../constants/Themes";

import styles from '../../css/CustomNavbar.module.scss';

import ThemeDropdownProps from "../../models/components/CustomNavbar/ThemeDropdown";

const ThemeDropdown: FC<ThemeDropdownProps> = ({ activeTheme, changeActiveTheme }) => (
	<NavDropdown
		id="ThemeDropdown"
		title="Theme"
		className={styles.navbarDropdown}
		onSelect={changeActiveTheme}
	>
		<Dropdown.Menu className={styles.dropdownMenu}>
			{
				Object.keys(themeList)
					.map((v: string) => {
						let className = styles.dropdownItem;
						if (v === activeTheme)
							className = `${styles.dropdownItem} ${styles.selected}`;

						return (
							<NavDropdown.Item
								eventKey={v}
								key={v}
								className={className}
							>
								{themeList[v]}
							</NavDropdown.Item>
						)
					})
			}
		</Dropdown.Menu>
	</NavDropdown>
);

export default ThemeDropdown;