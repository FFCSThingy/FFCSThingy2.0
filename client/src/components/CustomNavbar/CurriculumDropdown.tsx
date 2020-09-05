import React from 'react';
import { NavDropdown, Dropdown } from 'react-bootstrap';
import { connect, ConnectedProps } from 'react-redux';

import { setSelectedCurriculum } from '../../reducers/curriculum';

import styles from '../../css/CustomNavbar.module.scss';

import State from '../../models/state/State';

const mapStateToProps = (state: State) => ({
	curriculumList: state.curriculum.list,
	selected: state.curriculum.selectedPrefix,
});
const mapDispatch = { setSelectedCurriculum };

const connector = connect(mapStateToProps, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

const CurriculumDropdown = (props: PropsFromRedux) => (
	<NavDropdown
		id="CurriculumDropdown"
		title={props.selected}
		className={styles.navbarDropdown}
		onSelect={props.setSelectedCurriculum}
	>
		<Dropdown.Menu className={styles.dropdownMenu}>
			{
				props.curriculumList
					.map((v) => {
						if (!v) return <></>;

						let className = styles.dropdownItem;
						if (v === props.selected) className = `${styles.dropdownItem} ${styles.selected}`;

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

export default connector(CurriculumDropdown);
