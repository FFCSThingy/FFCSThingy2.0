import React, { useState } from 'react';

import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import {
	Navbar, Nav, NavDropdown, NavbarBrand, Modal, Button, Dropdown,
} from 'react-bootstrap';
import { FaBars } from 'react-icons/fa';

import styles from '../css/CustomNavbar.module.scss';

import brandImage from '../images/logo.1.png';

const CustomNavbar = ({
	curriculumList, themeList, selectedCurriculum, handleCurriculumChange,
	changeActiveTheme, creditCount, doLogout, userDetails,
}) => {
	const [showModal, setShowModal] = useState(false);

	const CurriculumChoices = () => curriculumList.map((v) => (
		<NavDropdown.Item
			eventKey={v}
			className={styles.dropdownItem}
		>
			{v}
			<NavDropdown.Divider className={styles.dropdownDivider} />
		</NavDropdown.Item>
	));

	const ThemeChoices = () => Object.keys(themeList).map((v) => (
		<NavDropdown.Item
			eventKey={v}
			key={v}
			className={styles.dropdownItem}
		>
			{themeList[v]}
			<NavDropdown.Divider className={styles.dropdownDivider} />
		</NavDropdown.Item>
	));

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


				<NavDropdown
					title={selectedCurriculum}
					className={styles.navbarDropdown}
					onSelect={handleCurriculumChange}
				>
					<Dropdown.Menu className={styles.dropdownMenu}>
						<CurriculumChoices />
					</Dropdown.Menu>
				</NavDropdown>


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

					<NavDropdown
						title="Theme"
						className={styles.navbarDropdown}
						onSelect={changeActiveTheme}
					>
						<Dropdown.Menu className={styles.dropdownMenu}>
							<ThemeChoices />
						</Dropdown.Menu>
					</NavDropdown>

					<NavDropdown
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
							<NavDropdown.Item disabled className={styles.dropdownItem}>
								{userDetails.display_name}
								<NavDropdown.Divider className={styles.dropdownDivider} />
							</NavDropdown.Item>

							<NavDropdown.Item
								onClick={doLogout}
								className={styles.dropdownItem}
							>
								Logout
								<NavDropdown.Divider className={styles.dropdownDivider} />
							</NavDropdown.Item>
						</Dropdown.Menu>
					</NavDropdown>
				</div>

			</Navbar.Collapse>

		</Navbar>
	);
};

export default CustomNavbar;
