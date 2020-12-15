import React from 'react';
import { NavDropdown, Dropdown } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';

import themeList from '../../constants/Themes';
import { changeTheme } from '../../reducers/misc';

import styles from '../../css/CustomNavbar.module.scss';

import { selectTheme } from '../../selectors/misc';

const ThemeDropdown = () => {
	const dispatch = useDispatch();
	const theme = useSelector(selectTheme);

	return (
		<NavDropdown
			id="ThemeDropdown"
			title="Theme"
			className={styles.navbarDropdown}
			onSelect={
				(selectedTheme: string) => dispatch(changeTheme(selectedTheme))
			}
		>
			<Dropdown.Menu className={styles.dropdownMenu}>
				{
					Object.keys(themeList)
						.map((v: string) => {
							let className = styles.dropdownItem;
							if (v === theme) {
								className = `${styles.dropdownItem} ${styles.selected}`;
							}

							return (
								<NavDropdown.Item
									eventKey={v}
									key={v}
									className={className}
								>
									{themeList[v]}
								</NavDropdown.Item>
							);
						})
				}
			</Dropdown.Menu>
		</NavDropdown>
	);
};

export default ThemeDropdown;
