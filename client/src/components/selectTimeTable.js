import React from 'react';
import { Container, Dropdown, ButtonGroup, Button, Card } from 'react-bootstrap';
import { FaTrashAlt, FaCopy, FaPlusSquare } from 'react-icons/fa';
import './selectTimeTable.css';
import "./TimeTable.css";
export default class SelectTimeTable extends React.Component {

	constructor(props, context) {
		super(props, context);

		this.handleShow = this.handleShow.bind(this);
		this.handleClose = this.handleClose.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleSave = this.handleSave.bind(this);

		this.state = {
			show: false,
			value: ""
		};
	}

	handleClose() {
		this.setState({
			show: false,
			value: ''
		});
	}

	handleShow() {
		if(this.state.show===false)
			this.setState({ show: true });
		else
			this.setState({ show: false });
	}

	handleChange(event) {
		this.setState({
			value: event.target.value
		})
	}

	handleSave(event) {
		this.setState({ show: false });
		var newTimetable = this.state.value;
		if (newTimetable === "") return;
		if (newTimetable != null) {
			var timetableNames = this.props.timetableNames
			if (!timetableNames.includes(newTimetable)) {
				timetableNames.push(newTimetable)
				this.props.modifyTimetableNames(timetableNames);

				this.props.changeActiveTimetable(newTimetable);
			}
			else {
				this.handleShow();
			}
		}
	}

	renderCard = () => {
		if (!this.state.show) {
			return;
		}
		return <Card>
		<Card.Body className="inputPopup">
			<input placeholder="Enter name"
			class="inputField" type="text" value={this.state.value} onChange={this.handleChange}
			spellCheck='false'
			autoComplete='off' />
			<Button className="saveButton" onClick={this.handleSave}>
				<FaPlusSquare />
			</Button>
		</Card.Body>
		</Card>
	}

	handleSelect = (Detail) => {
		this.props.changeActiveTimetable(Detail);
	}

	handleCopy = () => {
		this.handleShow();
	}

	handleDelete = (deleteTable) => {
		if (deleteTable === this.props.activeTimetable) {
			var changeActiveTable = true;
		}
		if (deleteTable === 'Default') {
			return;
		}
		var timetableNames = this.props.timetableNames
		var index = timetableNames.indexOf(deleteTable);
		if (index !== -1 && timetableNames.length > 1) {
			timetableNames.splice(index, 1);
			this.props.modifyTimetableNames(timetableNames);

			if (changeActiveTable && timetableNames.length !== 0) this.props.changeActiveTimetable(timetableNames[0])
		}
	}

	createDropdownItem = (active, eventKey, Detail) => {
		if (active)
			return <ButtonGroup className="dropdownButtonGroup">
				<Button className="detail" onClick={() => { this.handleSelect(Detail) }}>{Detail}</Button>
				<Button onClick={() => { this.handleCopy() }}><FaCopy /></Button>
				<Button onClick={() => { this.handleDelete(Detail) }}><FaTrashAlt /></Button>
			</ButtonGroup>
		else
			return <ButtonGroup className="dropdownButtonGroup">
				<Button className="dropdownTimetable dropdownButton detail" onClick={() => { this.handleSelect(Detail) }}>{Detail}</Button>
				<Button className="dropdownTimetable dropdownButton" onClick={() => { this.handleCopy() }}><FaCopy /></Button>
				<Button className="dropdownTimetable dropdownButton" onClick={() => { this.handleDelete(Detail) }}><FaTrashAlt /></Button>
			</ButtonGroup>
	}

	render() {
		var timetableNames = this.props.timetableNames
		var items = [];
		timetableNames.forEach((timetableName, index) => {
			let active = false;

			if (timetableName === this.props.activeTimetable)
				active = true;

			items.push(this.createDropdownItem(active, index, timetableName))
		});

		return (
			<>
				<div>
					<Dropdown drop="right" className="selectTimeTable">
						<Dropdown.Toggle className="selectedCourseHead">Time Tables</Dropdown.Toggle>
						<Dropdown.Menu className="dropdownTimetable border">
							{items}
							<Dropdown.Divider />
							<Container>
								<Button
								className="dropdownTimeTable dropdownButton"
								onClick={this.handleShow}
								>
									Create New <FaPlusSquare />
								</Button>
							</Container>
							<Dropdown.Divider />
							{this.renderCard()}
						</Dropdown.Menu>
					</Dropdown>
				</div>
			</>
		);
	}
}
