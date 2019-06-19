import React, { Component } from "react";
import "../css/magicFill.css";
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';

import { Container, Form, Button, ButtonGroup } from 'react-bootstrap';

class Generator extends Component {
	handleClick = (e) => {
		var filter = document.getElementById("magicData");
		if (filter.className === "hide") {
			filter.className = "show";
		}
		else {
			filter.className = "hide";
		}
	}

	handleTime = (e) => {
		if (e.target.id === "filterButton-1") {
			e.target.id = "filterButton-2";
			var x = document.getElementsByClassName("btn btn-primary active slots");
			if (x.length !== 0) {
				x[0].id = "filterButton-1";
				x[0].className = "btn btn-primary active";
			}
			e.target.className = "btn btn-primary active slots"
		}
		else {
			e.target.id = "filterButton-1";
			e.target.className = "btn btn-primary active"
		}
	}
	handleDay = (e) => {
		if (e.target.id === "filterButton-1") {
			e.target.id = "filterButton-2";
			var x = document.getElementsByClassName("btn btn-primary active day");
			if (x.length !== 0) {
				x[0].id = "filterButton-1";
				x[0].className = "btn btn-primary active";
			}
			e.target.className = "btn btn-primary active day"
		}
		else {
			e.target.id = "filterButton-1";
			e.target.className = "btn btn-primary active";
		}
	}
	handleCourseType = (e) => {
		if (e.target.id === "filterButton-1") {
			e.target.id = "filterButton-2";
			var x = document.getElementsByClassName("btn btn-primary active course");
			if (x.length !== 0) {
				x[0].id = "filterButton-1";
				x[0].className = "btn btn-primary active";
			}
			e.target.className = "btn btn-primary active course"
		}
		else {
			e.target.id = "filterButton-1";
			e.target.className = "btn btn-primary active"
		}
	}
	handleGaps = (e) => {
		if (e.target.id === "filterButton-1") {
			e.target.id = "filterButton-2";
			var x = document.getElementsByClassName("btn btn-primary active gaps");
			if (x.length !== 0) {
				x[0].id = "filterButton-1";
				x[0].className = "btn btn-primary active";
			}
			e.target.className = "btn btn-primary active gaps"
		}
		else {
			e.target.id = "filterButton-1";
			e.target.className = "btn btn-primary active"
		}
	}

	render() {
		var style1 = { "border-left": "none" };
		var style2 = { "border-right": "none" };
		return (
			<Container id="magicContainer">

				<Button variant="primary" onClick={this.handleClick} id="magic" >Magic Fill</Button>
				<div className="hide" id="magicData">
					<Form.Group>
						<label for="creditsEnterlabel" id="creditLabel">How many Credits do you want?</label><hr className="hrz"></hr>
						<input class="form-control" id="creditsEnter" type="number" />
					</Form.Group>
					<h5>What are your top priorities?</h5><hr></hr>
					<ButtonGroup aria-label="first" className="magicButtons">
						<Button variant="primary" onClick={this.handleTime} id="filterButton-1" style={style2}>Morning Slots</Button>
						<Button variant="primary" onClick={this.handleTime} id="filterButton-1" style={style1}>Evening Slots</Button>
					</ButtonGroup>
					<ButtonGroup aria-label="first" className="magicButtons">
						<Button variant="primary" onClick={this.handleDay} id="filterButton-1" style={style2}>Less Classes on Friday</Button>
						<Button variant="primary" onClick={this.handleDay} id="filterButton-1" style={style1}>Less Classes on Monday</Button>
					</ButtonGroup>
					<ButtonGroup aria-label="first" className="magicButtons">
						<Button variant="primary" onClick={this.handleCourseType} id="filterButton-1" style={style2}>Less Lab Courses</Button>
						<Button variant="primary" onClick={this.handleCourseType} id="filterButton-1" style={style1}>Less Project Courses</Button>
					</ButtonGroup>
					<ButtonGroup aria-label="first" className="magicButtons">
						<Button variant="primary" onClick={this.handleGaps} id="filterButton-1" style={style2}>Prefer Gaps in Timetable</Button>
						<Button variant="primary" onClick={this.handleGaps} id="filterButton-1" style={style1}>Less Gaps</Button>
					</ButtonGroup>
					<br></br>
					<Button variant="primary" id="submitButton">Find your Timetable</Button>
				</div>

			</Container>
		)
	}
}

export default Generator;