import React from 'react';

import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Nav, NavDropdown, NavbarBrand } from 'react-bootstrap';

import "whatwg-fetch";
import '../App.css';
import '../css/nav-bar.css'

import navbarImage from '../images/logo.png';


class CustomNavbar extends React.Component {

	renderThemeChoices = () => {
		return Object.keys(this.props.themes).map(v => {
			return (
				<NavDropdown.Item eventKey={v} key={v}>{this.props.themes[v].name}
					<NavDropdown.Divider />
				</NavDropdown.Item>
			)
		})
	}

	renderCurriculumChoices = () => {
		return this.props.curriculumList.map(v => <NavDropdown.Item eventKey={v}>{v} 
				<NavDropdown.Divider />
			</NavDropdown.Item>);
	}

	render() {
		return (
			<Navbar className="navBar" bg="light" fixed="top" expand="md">
				
				<NavbarBrand className="navbar-left">
					{/* <img className="logo" alt="FFCSThingy" src={navbarImage}></img> */}
					FFCSThingy
				</NavbarBrand>

				<NavDropdown 
					title={this.props.selectedCurriculum} 
					className="navDropContainerCurriculum"
					onSelect={this.props.handleCurriculumChange}
				>
					{this.renderCurriculumChoices()}
				</NavDropdown>

				<Navbar.Toggle aria-controls="responsive-navbar-nav" />

				<Navbar.Collapse className="linksContainer" id="basic-navbar-nav">
					
					<Nav className="mr-auto">
						<Nav.Link href='/about' className="navLink">About</Nav.Link>
					</Nav>

					<Nav className="navLeft">
						<Nav.Link className="navLink" disabled>
							Credits: {this.props.creditCount}
						</Nav.Link>

						<NavDropdown
							title="Theme"
							className="navDropContainerTheme"
							onSelect={this.props.changeActiveTheme}
						>
							{this.renderThemeChoices()}
						
						</NavDropdown>
						
						<NavDropdown 
							alignRight
							title={<img className="userProfileImage" alt=""
							src={this.props.user.picture} />} 
							className="navDropContainerUser"
						>
							<NavDropdown.Item disabled>
								{this.props.user.display_name}
							</NavDropdown.Item>

							<NavDropdown.Divider />
							
							<NavDropdown.Item onClick={this.props.doLogout}>Logout</NavDropdown.Item>
						</NavDropdown>
					</Nav>

				</Navbar.Collapse>
			
			</Navbar>
		)
	}

}

export default CustomNavbar;