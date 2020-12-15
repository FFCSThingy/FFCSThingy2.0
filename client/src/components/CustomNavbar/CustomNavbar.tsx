import React, { useState, memo } from 'react';
import { useSelector } from 'react-redux';

import {
	Navbar, Nav, NavbarBrand, Modal, Button,
} from 'react-bootstrap';
import { FaBars } from 'react-icons/fa';

import CurriculumDropdown from './CurriculumDropdown';
import ThemeDropdown from './ThemeDropdown';
import UserDropdown from './UserDropdown';

import styles from '../../css/CustomNavbar.module.scss';
import brandImage from '../../images/logo.1.png';

import { selectCreditCount } from '../../selectors/timetable';

const CustomNavbar = memo(() => {
	const creditCount = useSelector(selectCreditCount);

	const [showModal, setShowModal] = useState(false);

	const EXTENSION_LINK = 'https://chrome.google.com/webstore/detail/ffcsooo/mepdkhhjialfmbggojniffnjidbdhpmh';

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
					{'Generate timetable automatically, see completed courses in course selector '
					+ 'and more. Add an extension to your browser and sync with VTOP!'}
				</p>
				<a
					href={EXTENSION_LINK}
					target="_blank"
					rel="noopener noreferrer"
				>
					Chrome Extension
				</a>
				<br />
				<a
					href="https://ffcs.ooo/files_ext/ffcsooo-1.4-an+fx.xpi"
					rel="noopener noreferrer"
				>
					Firefox Addon (Desktop and Android)
				</a>
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

				<CurriculumDropdown />

				<Navbar.Toggle
					className={styles.mobileMenuToggle}
				>
					<FaBars />
				</Navbar.Toggle>
			</div>

			<Navbar.Collapse className={styles.collapseContainer}>

				<div className={styles.middleContainer}>
					<Nav.Link
						href={`
							${process.env.REACT_APP_BASE_URL
							|| 'http://localhost:3001'}/about
						`}
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

					<ThemeDropdown />

					<UserDropdown />
				</div>

			</Navbar.Collapse>

		</Navbar>
	);
});

export default CustomNavbar;
