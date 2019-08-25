import React from 'react';
import { Container, Dropdown, ButtonGroup, Button, Card, Form, DropdownButton } from 'react-bootstrap';
import { FaTrashAlt, FaCopy, FaPlusSquare, FaPen } from 'react-icons/fa';
import '../css/selectTimeTable.css';
import "../css/TimeTable.css";
// import { log } from 'util';
class SelectTimeTable extends React.Component {

	constructor(props, context) {
		super(props, context);
		this.state = {
			showEdit: false,
			showNew: false,
			showCopy: false,
			newName: '',

			show: false,
			value: ""
		};
	}

	// handleClose = () => {
	// 	this.setState({
	// 		show: false,
	// 		value: ''
	// 	});
	// }

	// handleShow = () => {
	// 	if(this.state.show===false)
	// 		this.setState({ show: true });
	// 	else
	// 		this.setState({ show: false });
	// }

	// handleChange = (event) => {
	// 	this.setState({
	// 		value: event.target.value
	// 	})
	// }

	// handleSave = (event) => {
	// 	this.setState({ show: false });
	// 	var newTimetable = this.state.value;
	// 	if (newTimetable === "") return;
	// 	if (newTimetable != null) {
	// 		var timetableNames = this.props.timetableNames
	// 		if (!timetableNames.includes(newTimetable)) {
	// 			timetableNames.push(newTimetable)
	// 			this.props.modifyTimetableNames(timetableNames);

	// 			this.props.changeActiveTimetable(newTimetable);
	// 		}
	// 		else {
	// 			this.handleShow();
	// 		}
	// 	}
	// }

	handleChange = (event) => {
		let fieldName = event.target.name;
		let fleldVal = event.target.value;
		this.setState({ [fieldName]: fleldVal })
	}

	handleCopy = () => {
		this.setState(prevState => ({
			showCopy: !prevState.showCopy,
			showEdit: false,
			showNew: false
		}));
	}

	handleEdit = () => {
		this.setState(prevState => ({
			showCopy: false,
			showEdit: !prevState.showEdit,
			showNew: false
		}));
	}

	handleNew = () => {
		this.setState(prevState => ({
			showCopy: false,
			showEdit: false,
			showNew: !prevState.showNew
		}));
	}

	handleDelete = () => {

	}

	renderInput = () => {
		if (this.state.showEdit || this.state.showCopy || this.state.showNew)
			return (
				<Form>
					<Form.Control
						type='text'
						value={this.state.newName}
						placeholder='Timetable Name'
						name='newName'
						onChange={this.handleChange.bind(this)}
						spellCheck="false"
						autoComplete="off"
					/>

					<Button className="okButton"
						onClick={() => {
								(this.state.showEdit) ? this.props.doEdit(this.state.newName)
									: (this.state.showNew) ? this.props.doNew(this.state.newName)
										: this.props.doCopy(this.state.newName);

								(this.state.showEdit) ? this.handleEdit()
									: (this.state.showNew) ? this.handleNew()
										: this.handleCopy();
							}
						}
					>
						Ok
						</Button>
				</Form>
			)
		else return;
	}

	renderDropdownItems = () => {
		return this.props.timetableNames.map(v => <Dropdown.Item eventKey={v}>{v}</Dropdown.Item>);
	}

	render() {
		return (
			<div className="dropdownButtonGroupContainer">
				<ButtonGroup className="dropdownButtonGroup">
					<DropdownButton
						title={this.props.activeTimetable}
						onSelect={this.props.changeActiveTimetable}
					>
						{this.renderDropdownItems()}
					</DropdownButton>

					<Button
						className="dropdownButton selectTimeTable"
						onClick={this.handleNew}
					>
						<FaPlusSquare />
					</Button>

					{/* <Button
						className="dropdownButton selectTimeTable"
						onClick={this.handleCopy}
					>
						<FaCopy />
					</Button> */}

					<Button
						className="dropdownButton selectTimeTable"
						onClick={this.handleEdit}
					>
						<FaPen />
					</Button>

					<Button
						className="dropdownButton selectTimeTable"
						onClick={this.props.doDelete}
					>
						<FaTrashAlt />
					</Button>

				</ButtonGroup>

				{this.renderInput()}
			</div>
		);
	}
}

export default SelectTimeTable;