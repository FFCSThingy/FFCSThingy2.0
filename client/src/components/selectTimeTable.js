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

	createDropdownItem = (eventKey, Detail) => {
		return <Dropdown.Item className="" onClick={() => { this.handleSelect(Detail) }}>{Detail}</Dropdown.Item>
	}

	showInputField = () => {
		if(this.state.show)
			return <>
			<input split type="text" placeholder="Enter Name" onChange={this.handleChange}/>
			<Button onClick={this.handleSave}>OK</Button>
			</>
		else
			return;
	}

	render() {
		var timetableNames = this.props.timetableNames
		var items = [];
		timetableNames.forEach((timetableName, index) => {

			if (timetableName === this.props.activeTimetable)
				return;
			items.push(this.createDropdownItem(index, timetableName))
		});

		console.log(this.state.show)

		return (
			<ButtonGroup>
				<Dropdown className="selectTimeTable" as={ButtonGroup}>
					<Button>Time Table</Button>
					<Dropdown.Toggle split className="selectedCourseHead">{this.props.activeTimetable} </Dropdown.Toggle>
					<Dropdown.Menu className="dropdownTimetable border">
						{items}
					</Dropdown.Menu>
				</Dropdown>
				<Button onClick={this.handleShow}><FaPlusSquare /></Button>
				<Button onClick={this.handleCopy}><FaCopy /></Button>
				<Button onClick={this.handleDelete}><FaTrashAlt /></Button>
				{this.showInputField()}
			</ButtonGroup>
		);
	}
}
