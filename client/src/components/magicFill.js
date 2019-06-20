import React, { Component } from "react";
import "../css/magicFill.css";
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';

import { Container, Form, Button, Row, Col, ToggleButton, ToggleButtonGroup, Alert } from 'react-bootstrap';

class Generator extends Component {
	state = {
		gaps: 'gaps',
		slots: 'morning',
		days: 'monday',
		lp: 'lab',
		showForm: false,
		showAlert: false,
	}

	handleChanges = (value, event) => {
		let fieldName = event.target.name;
		let fieldVal = event.target.value;
		this.setState({ [fieldName]: fieldVal });
	}

	handleShow = () => {
		if(this.props.user.vtopSignedIn)
			this.setState(prevState => ({ showForm: !prevState.showForm }))
		else
			this.setState({ showAlert: true })
	}

	handleDismiss = () => {
		this.setState({ showAlert: false });
	}

	renderAlert = () => {
		if(this.state.showAlert)
		return (
			<Alert variant='danger' onClose={this.handleDismiss} dismissible>
				<Alert.Heading>Oh snap! You haven't logged in to VTOP!</Alert.Heading>
				<p>
					Login to VTOP using our extension to access this feature.
				</p>
			</Alert>
		)
		else return;
	}

	renderToggles = () => {
		return (
			<Row>
				<Col sm={12} md={3}>
					<ToggleButtonGroup className="slotFilter"
						type='radio'
						name='slots'
						value={this.state.slots}
						onChange={this.handleChanges} >
						<ToggleButton value='morning' className='toggleCustom'>Morning</ToggleButton>
						<ToggleButton value='evening' className='toggleCustom'>Evening</ToggleButton>
					</ToggleButtonGroup>
				</Col>

				<Col sm={12} md={3}>
					<ToggleButtonGroup className="slotFilter"
						type='radio'
						name='days'
						value={this.state.days}
						onChange={this.handleChanges} >
						<ToggleButton value='monday' className='toggleCustom'>Less Classes on Monday</ToggleButton>
						<ToggleButton value='friday' className='toggleCustom'>Less Classes on Friday</ToggleButton>
					</ToggleButtonGroup>
				</Col>

				<Col sm={12} md={3}>
					<ToggleButtonGroup className="slotFilter"
						type='radio'
						name='gaps'
						value={this.state.gaps}
						onChange={this.handleChanges} >
						<ToggleButton value='gaps' className='toggleCustom'>Gaps</ToggleButton>
						<ToggleButton value='nogaps' className='toggleCustom'>No Gaps</ToggleButton>
					</ToggleButtonGroup>
				</Col>

				<Col sm={12} md={3}>
					<ToggleButtonGroup className="slotFilter"
						type='radio'
						name='lp'
						value={this.state.lp}
						onChange={this.handleChanges} >
						<ToggleButton value='lab' className='toggleCustom'>Less Labs</ToggleButton>
						<ToggleButton value='project' className='toggleCustom'>Less Projects</ToggleButton>
					</ToggleButtonGroup>
				</Col>
			</Row>
		)
	}

	renderForm = () => {
		if (this.state.showForm)
			return (
				<div>
					<Row>
						<Form.Group>
							<Form.Label>Number of credits:</Form.Label>
							<Form.Control type="number" placeholder="Credits" />
						</Form.Group>
					</Row>
					
					{this.renderAlert()}
					{this.renderToggles()}

					<Button className='magicButton dropdown-toggle'>Generate Timetable</Button>
				</div>
			)
		else return;
	}


	render() {
		return (
			<Container id="magicContainer">

				<Row>
					<Button 
						onClick={this.handleShow}
						className="magicButton dropdown-toggle"
					>
						Magic Fill
					</Button>
				</Row>

				{this.renderForm()}

			</Container>
		)
	}
}

export default Generator;