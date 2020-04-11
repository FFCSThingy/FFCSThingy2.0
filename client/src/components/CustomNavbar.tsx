import React, { useState, memo, FC } from 'react';

import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import {
	Navbar, Nav, NavDropdown, NavbarBrand, Modal, Button, Dropdown,
} from 'react-bootstrap';
import { FaBars } from 'react-icons/fa';

import styles from '../css/CustomNavbar.module.scss';

import themeList from '../constants/Themes';

import brandImage from '../images/logo.1.png';

interface UserDetails {
	display_name: string;
	picture: string;
}
interface CurriculumDropdown {
	curriculumList: string[];
	selectedCurriculum: string;
	handleCurriculumChange: Function;
}

const CurriculumDropdown: FC<CurriculumDropdown> = (
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

interface ThemeDropdownModel {
	changeActiveTheme: Function;
}

const ThemeDropdown: FC<ThemeDropdownModel> = ({ changeActiveTheme }) => (
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

interface UserDropdown {
	userDetails: UserDetails;
	doLogout: React.MouseEventHandler<this>;
}

const UserDropdown: FC<UserDropdown> = ({ userDetails, doLogout }) => (
	<NavDropdown
		id="UserDropdown"
		alignRight
		title={(
			<img
				className={styles.userProfileImage}
				alt=""
				src={userDetails.picture}
			/>
		)}
		className={styles.navbarDropdown}
	>
		<Dropdown.Menu className={styles.dropdownMenu}>
			<NavDropdown.Item disabled key="DisplayNameDropdownItem" className={styles.dropdownItem}>
				{userDetails.display_name}
				<NavDropdown.Divider className={styles.dropdownDivider} />
			</NavDropdown.Item>

			<NavDropdown.Item
				onClick={doLogout}
				className={styles.dropdownItem}
				key="LogoutDropdownItem"
			>
				Logout
				<NavDropdown.Divider className={styles.dropdownDivider} />
			</NavDropdown.Item>
		</Dropdown.Menu>
	</NavDropdown>
);

interface CustomNavbar {
	curriculumList: string[];
	selectedCurriculum: string;
	creditCount: number;
	userDetails: UserDetails;
	handleCurriculumChange: Function;
	changeActiveTheme: Function;
	doLogout: React.MouseEventHandler<this>;
}

const CustomNavbar: FC<CustomNavbar> = memo(
	({
		curriculumList, selectedCurriculum, handleCurriculumChange,
		changeActiveTheme, creditCount, doLogout, userDetails = { display_name: '', picture: '' },
	}) => {
		const [showModal, setShowModal] = useState(false);



		const SyncModal = () => (
			<Modal
				size="lg"
				centered
				show={showModal}
				onHide={() => setShowModal(false)}
			>
				<Modal.Header closeButton className={styles.popup}>
					<Modal.Title>
						Sync with VTOP
				</Modal.Title>
				</Modal.Header>

				<Modal.Body className={styles.popup}>
					<p>
						Generate timetable automatically, see completed courses in course selector and more. Add an extension to your browser and sync with VTOP!
				</p>
					<a href="https://chrome.google.com/webstore/detail/ffcsooo/mepdkhhjialfmbggojniffnjidbdhpmh" target="_blank" rel="noopener noreferrer">Chrome Extension</a>
					<br />
					<a href="https://ffcs.ooo/files_ext/ffcsooo-1.4-an+fx.xpi" rel="noopener noreferrer">Firefox Addon (Desktop and Android)</a>
				</Modal.Body>

				<Modal.Footer className={styles.popup}>
					<Button
						onClick={() => setShowModal(false)}
						className={styles.closeButton}
					>
						Close
				</Button>
				</Modal.Footer>

			</Modal>
		);

		return (
			<Navbar className={styles.navbar} fixed="top" expand="md">

				<div className={styles.leftContainer}>
					<NavbarBrand
						className={styles.navbarBrand}
					>
						<img className={styles.logo} alt="" src={brandImage} />
						<span className={styles.branding}>FFCSThingy</span>
					</NavbarBrand>


					<CurriculumDropdown
						curriculumList={curriculumList}
						selectedCurriculum={selectedCurriculum}
						handleCurriculumChange={handleCurriculumChange}
					/>


					<Navbar.Toggle
						className={styles.mobileMenuToggle}
					>
						<FaBars />
					</Navbar.Toggle>
				</div>

				<Navbar.Collapse className={styles.collapseContainer}>

					<div className={styles.middleContainer}>
						<Nav.Link
							href={`${process.env.REACT_APP_BASE_URL || 'http://localhost:3001'}/about`}
							className={styles.navLink}
						>
							About
					</Nav.Link>
						<Nav.Link
							href="https://discord.gg/Un4UanH"
							className={styles.navLink}
							target="_blank"
						>
							Join our Discord
					</Nav.Link>
						{/* <Nav.Link
						onClick={() => setShowModal(true)}
						className={`${styles.navLink} ${styles.sync}`}
					>
						Sync VTOP
					</Nav.Link> */}
					</div>

					<SyncModal />

					<div className={styles.rightContainer}>
						<Nav.Link className={styles.navLink} disabled>
							{`Credits: ${creditCount}`}
						</Nav.Link>

						<ThemeDropdown
							changeActiveTheme={changeActiveTheme}
						/>

						<UserDropdown
							userDetails={userDetails}
							doLogout={doLogout}
						/>
					</div>

				</Navbar.Collapse>

			</Navbar>
		);
	}
);

export default CustomNavbar;
