import React from 'react';
import { NavDropdown, Dropdown } from 'react-bootstrap';
import { connect, ConnectedProps } from 'react-redux';

import themeList from '../../constants/Themes';
import { changeTheme } from '../../reducers/misc';

import styles from '../../css/CustomNavbar.module.scss';

import StateModel from '../../models/state/State';

const mapStateToProps = (state: StateModel) => ({ theme: state.misc.theme });
const mapDispatch = { changeTheme };

const connector = connect(mapStateToProps, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

const ThemeDropdown = (props: PropsFromRedux) => (
	<NavDropdown
		id="ThemeDropdown"
		title="Theme"
		className={styles.navbarDropdown}
		onSelect={props.changeTheme}
	>
		<Dropdown.Menu className={styles.dropdownMenu}>
			{
				Object.keys(themeList)
					.map((v: string) => {
						let className = styles.dropdownItem;
						if (v === props.theme) {
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

export default connector(ThemeDropdown);
