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
						.map((v) => (
							<NavDropdown.Item
								key={v}
								eventKey={v}
								className={styles.dropdownItem}
							>
								{v}
								<NavDropdown.Divider className={styles.dropdownDivider} />
							</NavDropdown.Item>
						))
				}
			</Dropdown.Menu>
		</NavDropdown>
	);

export default CurriculumDropdown;