import React, { FC } from "react";
import { NavDropdown, Dropdown } from "react-bootstrap";

import styles from '../../css/CustomNavbar.module.scss';

import CurriculumDropdownProps from '../../models/components/CustomNavbar/CurriculumDropdown';

const CurriculumDropdown: FC<CurriculumDropdownProps> = (
	{ curriculumList, selectedCurriculum, handleCurriculumChange }
) => (
		<NavDropdown
			id="CurriculumDropdown"
			title={selectedCurriculum}
			className={styles.navbarDropdown}
			onSelect={handleCurriculumChange}
		>
			<Dropdown.Menu className={styles.dropdownMenu}>
				{
					curriculumList
						.map((v) => {
							if(!v)
								return <></>;

							let className = styles.dropdownItem;
							if(v === selectedCurriculum)
								className = `${styles.dropdownItem} ${styles.selected}`;

							return (
								<NavDropdown.Item
									key={v}
									eventKey={v}
									className={className}
								>
									{v}
								</NavDropdown.Item>
							)
						}
						)
				}
			</Dropdown.Menu>
		</NavDropdown>
	);

export default CurriculumDropdown;