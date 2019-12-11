import React from 'react';
import {
	Dropdown, ButtonGroup, Button, Form, DropdownButton,
} from 'react-bootstrap';
import { FaTrashAlt, FaPlusSquare, FaPen } from 'react-icons/fa';
import '../css/TimetableSwitcher.css';
import '../css/TimeTable.css';
// import { log } from 'util';
class TimetableSwitcher extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			showEdit: false,
			showNew: false,
			showCopy: false,
			newName: '',
		};
	}

	handleChange = (event) => {
		const fieldName = event.target.name;
		const fleldVal = event.target.value;
		this.setState({ [fieldName]: fleldVal });
	}

	handleCopy = () => {
		this.setState((prevState) => ({
			showCopy: !prevState.showCopy,
			showEdit: false,
			showNew: false,
		}));
	}

	handleEdit = () => {
		this.setState((prevState) => ({
			showCopy: false,
			showEdit: !prevState.showEdit,
			showNew: false,
		}));
	}

	handleNew = () => {
		this.setState((prevState) => ({
			showCopy: false,
			showEdit: false,
			showNew: !prevState.showNew,
		}));
	}

	okButtonClickHandler = () => {
		if (this.state.showEdit) {
			this.props.doEdit(this.state.newName);
			this.handleEdit();
		} else if (this.state.showNew) {
			this.props.doNew(this.state.newName);
			this.handleNew();
		} else if (this.state.showCopy) {
			this.props.doCopy(this.state.newName);
			this.handleCopy();
		}
	}

	renderInput = () => {
		if (this.state.showEdit || this.state.showCopy || this.state.showNew) {
			return (
				<Form>
					<Form.Control
						type="text"
						value={this.state.newName}
						placeholder="Timetable Name"
						name="newName"
						onChange={this.handleChange}
						spellCheck="false"
						autoComplete="off"
					/>

					<Button
						className="okButton"
						onClick={this.okButtonClickHandler}
					>
						Ok
					</Button>
				</Form>
			);
		}
		return <></>;
	}

	renderDropdownItems = () => this.props.timetableNames.map((v) => <Dropdown.Item eventKey={v} className="timetableSwitcherDropdownItem">{v}</Dropdown.Item>)

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

export default TimetableSwitcher;
