import React, { Component } from "react";
import "../css/MagicFill.css";
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';

import { Container, Form, Button, Row, Col, ToggleButton, ToggleButtonGroup, Alert } from 'react-bootstrap';
import ButtonToolbar from "react-bootstrap/ButtonToolbar";
import { FaTrashAlt } from "react-icons/fa";

class MagicFill extends Component {

	constructor(props) {
		super(props);
		this.state = {
			gaps: undefined,
			slots: undefined,
			days: undefined,
			lp: undefined,
			showForm: false,
			showAlert: false,
			credits: 23,
			generatingInProcess: props.inProcess,
			priorityList: [],
		};
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		if (prevProps.inProcess !== this.props.inProcess) {
			this.setState({ generatingInProcess: this.props.inProcess });
		}
	}

	handleChanges = (value, event) => {
		let fieldName = event.target.name;
		let fieldVal = event.target.value;
		if (this.state[fieldName] === fieldVal) {
			fieldVal = undefined;
			var newPriorityList = this.state.priorityList.filter(item => item !== fieldName);
			this.setState({ priorityList: newPriorityList });
		} else {
			this.state.priorityList.push(fieldName);
		}
		this.setState({ [fieldName]: fieldVal });
	}


	handleShow = () => {
		if (this.props.user.vtopSignedIn)
			this.setState(prevState => ({ showForm: !prevState.showForm }))
		else
			this.setState({ showAlert: true });
	}

	handleDismiss = () => {
		this.setState({ showAlert: false });
	}

	renderAlert = () => {
		if (this.state.showAlert)
			return (
				<Alert variant='danger' onClose={this.handleDismiss} dismissible>
					<Alert.Heading>Oh snap! You haven't synced with VTOP!</Alert.Heading>
					<p>
						Login to VTOP using our extension to access this feature.
				</p>
				</Alert>
			)
		else return;
	}

	renderMorningEveningButton = () => {
		if (this.state.slots === undefined && this.state.priorityList.length < 3) {
			return (<ToggleButtonGroup className="slotFilter"
				type='checkbox'
				name='slots'
				value={this.state.slots}
				onChange={this.handleChanges}>
				<ToggleButton value='morning' className='toggleCustom'>Morning</ToggleButton>
				<ToggleButton value='evening' className='toggleCustom'>Evening</ToggleButton>
			</ToggleButtonGroup>);
		}
		return null;
	}

	renderDayButtons = () => {
		if (this.state.days === undefined && this.state.priorityList.length < 3) {
			return (<ToggleButtonGroup className="slotFilter"
				type='checkbox'
				name='days'
				value={this.state.days}
				onChange={this.handleChanges} >
				<ToggleButton value='Monday' className='toggleCustom'>Less Classes on Monday</ToggleButton>
				<ToggleButton value='Friday' className='toggleCustom'>Less Classes on Friday</ToggleButton>
			</ToggleButtonGroup>);
		}
		return null;
	}

	renderGapButtons = () => {
		if (this.state.gaps === undefined && this.state.priorityList.length < 3) {
			return (<ToggleButtonGroup className="slotFilter"
				type='checkbox'
				name='gaps'
				value={this.state.gaps}
				onChange={this.handleChanges} >
				<ToggleButton value='gaps' className='toggleCustom'>Gaps</ToggleButton>
				<ToggleButton value='nogaps' className='toggleCustom'>No Gaps</ToggleButton>
			</ToggleButtonGroup>);
		}
		return null;
	}

	renderLPButtons = () => {
		if (this.state.lp === undefined && this.state.priorityList.length < 3) {
			return (<ToggleButtonGroup className="slotFilter"
				type='checkbox'
				name='lp'
				value={this.state.lp}
				onChange={this.handleChanges} >
				<ToggleButton value='ELA' className='toggleCustom'>Less Labs</ToggleButton>
				<ToggleButton value='EPJ' className='toggleCustom'>Less Projects</ToggleButton>
			</ToggleButtonGroup>);
		}
		return null;
	}

	renderToggles = () => {
		return (
			<Row className="toggles">
				<Container className="togglesA">
					<Col sm={12} md={3}>
						{this.renderMorningEveningButton()}
						{this.renderDayButtons()}
					</Col>
				</Container>

				<Container className="togglesB">
					<Col sm={12} md={3}>
						{this.renderGapButtons()}
						{this.renderLPButtons()}
					</Col>
				</Container>
			</Row>
		)
	}

	renderPriorityPref() {
		let selectedElements = [];
		for (let elem in this.state.priorityList) {
			const value = this.state.priorityList[elem];
			let toPush;
			const event = { target: { name: value, value: this.state[value] } };
			const onClickHandler = () => { this.handleChanges(value, event) };
			switch (this.state[value]) {
				case 'ELA':
					toPush = 'Less Labs ';
					break;
				case 'EPJ':
					toPush = 'Less Projects';
					break;
				case 'gaps':
					toPush = 'Gaps';
					break;
				case 'nogaps':
					toPush = 'No Gaps';
					break;
				case 'Monday':
					toPush = 'Less Classes on Monday';
					break;
				case 'Friday':
					toPush = 'Less Classes on Friday';
					break;
				case 'morning':
					toPush = 'Morning';
					break;
				case 'evening':
					toPush = 'Evening';
					break;
				default: ;
			}
			const btn = <Button onClick={onClickHandler} className='dropdownButton'>{toPush}<FaTrashAlt /></Button>;
			selectedElements.push(btn);
		}
		return (<Col sm={12} md={8} className="form-group"><ButtonToolbar>
			{selectedElements}
		</ButtonToolbar></Col>);
	}

	buildPrefAndSend = () => {
		let prefs = {
			'slot': { 'evening': 1, 'morning': 1 }, 'course': { 'ELA': 1, 'EPJ': 1, 'ETH': 1 },
			'days': { 'Monday': 1, 'Tuesday': 1, 'Wednesday': 1, 'Thursday': 1, 'Friday': 1 }, 'misc': { 'checkboard': 0 }
		};
		prefs.credits = this.state.credits;
		for (let elem in this.state.priorityList) {
			const name = this.state.priorityList[elem];
			const value = this.state[name];
			if (name === 'slots') {
				prefs.slot[value] = (4 - elem + 1);
			}
			else if (name === 'lp') {
				prefs.course[value] = -(4 - elem + 1) / 4.8;
			}
			else if (name === 'days') {
				prefs.days[value] = -(4 - elem + 1) / 6;
			}
			else if (name === 'gaps') {
				prefs.misc.checkboard = (value === 'gaps') ? 1 : 0;
			}
		}
		this.props.genTT(prefs);
	}

	renderGenButton() {
		if (!this.state.generatingInProcess) {
			return (<Button className='magicButton dropdownButton' onClick={() => { this.buildPrefAndSend() }}>Generate Timetable</Button>);
		}
		return (<Button className='magicButton dropdownButton' style={{ "opacity": 0.3 }}>Generate Timetable</Button>);
	}

	renderForm = () => {
		if (this.state.showForm)
			return (
				<div>
					<Row>
						<Form.Group className="creditsPlaceholder">
							<Form.Control type="number" placeholder="No. of credits" onChange={(e) => this.setState({ credits: e.target.value })} />
						</Form.Group>
					</Row>
					<Row className="toggles">
						{this.renderPriorityPref()}
					</Row>
					{this.renderToggles()}
					{this.renderGenButton()}
				</div>
			)
		else return;
	}


	render() {
		return (
			<Container id="magicContainer">


				<Button
					onClick={this.handleShow}
					className="magicButton dropdown-toggle"
				>
					Magic Fill
					</Button>


				{this.renderForm()}
				{this.renderAlert()}


			</Container>
		)
	}
}

export default MagicFill;
