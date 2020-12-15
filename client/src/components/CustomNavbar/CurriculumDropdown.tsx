import React from 'react';
import { NavDropdown, Dropdown } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

import { setSelectedCurriculum } from '../../reducers/curriculum';

import styles from '../../css/CustomNavbar.module.scss';

import { selectCurriculumList, selectSelectedPrefix } from '../../selectors/curriculum';

const CurriculumDropdown = () => {
	const dispatch = useDispatch();
	const curriculumList = useSelector(selectCurriculumList);
	const selected = useSelector(selectSelectedPrefix);

	return (
		<NavDropdown
			id="CurriculumDropdown"
			title={selected}
			className={styles.navbarDropdown}
			onSelect={
				(selectedCurr: string) => dispatch(setSelectedCurriculum(selectedCurr))
			}
		>
			<Dropdown.Menu className={styles.dropdownMenu}>
				{
					curriculumList
						.map((v) => {
							if (!v) return <></>;

							let className = styles.dropdownItem;
							if (v === selected) {
								className = `${styles.dropdownItem} ${styles.selected}`;
							}

							return (
								<NavDropdown.Item
									key={v}
									eventKey={v}
									className={className}
								>
									{v}
								</NavDropdown.Item>
							);
						})
				}
			</Dropdown.Menu>
		</NavDropdown>
	);
};

export default CurriculumDropdown;
