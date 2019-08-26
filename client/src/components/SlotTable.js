import React, { Component } from "react";

import { Card, Col, CardColumns, Container, ToggleButtonGroup, ToggleButton, Row } from 'react-bootstrap';

import '../css/SlotTable.css';

class SlotTable extends Component {

	state = {
		error: null,
		currentCourses: [],
		typeFilters: [],
		venueFilters: [],
	}

	componentWillReceiveProps(nextProps) {
		if(nextProps.selectedCourse !== this.props.selectedCourse)
			this.setState({
				typeFilters: [],
				venueFilters: [] 
			});
	}

	doFilter = () => {
		return this.props.slots.filter(course => {	// Filter on course_type
			if (this.state.typeFilters.length === 0) return true;
			return this.state.typeFilters.reduce((a, v) => (a || (course.simple_type === v)), false);
		}).filter(course => {	// Filter on Venue
			if (this.state.venueFilters.length === 0) return true;
			else if (this.state.typeFilters.includes('Project') && course.simple_type === 'Project') return true;
			else return this.state.venueFilters.reduce((a, v) => (a || (course.venue.startsWith(v))), false);
		});
	}

	handleTypeChange = (value, event) => {
		this.setState({ typeFilters: value });
	}

	handleVenueChange = (value, event) => {
		this.setState({ venueFilters: value });
	}

	renderNormalCard(value) {
		return (
			<Card
				className="cardContainer"
				key={value._id}
				onClick={() => this.props.selectSlots(value)} >

				<Card.Body className="cardBody">
					<Card.Text>{value.slot}</Card.Text>
					<Card.Title>{value.faculty}</Card.Title>
					<Card.Subtitle className="cardSubtitle">{value.venue} - {value.course_type}
					</Card.Subtitle>

					<Card.Subtitle className="cardSubtitle">Popularity - <b>{Math.floor(value.percent)}%</b></Card.Subtitle>
				</Card.Body>

			</Card>
		)
	}

	renderClashCard(value) {
		return (
			<Card
				className="cardContainer"
				key={value._id}
				>

				<Card.Body className="cardBodyClash">
					<Card.Text>{value.slot}</Card.Text>
					<Card.Title>{value.faculty}</Card.Title>
					<Card.Subtitle className="cardSubtitle">{value.venue} - {value.course_type}
					<Card.Subtitle className="cardClashSubtitle">Clashing</Card.Subtitle>
					</Card.Subtitle>
					
					<Card.Subtitle className="cardSubtitle">Popularity - <b>{Math.floor(value.percent)}%</b></Card.Subtitle>
				</Card.Body>

			</Card>
		)
	}

	renderSelectedCard(value) {
		return (
			<Card
				className="cardContainer"
				key={value._id}
			>

				<Card.Body className="cardBodySelected">
					<Card.Text>{value.slot}</Card.Text>
					<Card.Title>{value.faculty}</Card.Title>
					<Card.Subtitle className="cardSubtitle">{value.venue} - {value.course_type}
						<Card.Subtitle className="cardSelectedSubtitle">Selected</Card.Subtitle>
					</Card.Subtitle>

					<Card.Subtitle className="cardSubtitle">Popularity - <b>{Math.floor(value.percent)}%</b></Card.Subtitle>
				</Card.Body>

			</Card>
		)
	}

	render() {
		var normalCourses = [], selectedCourses = [], clashingCourses = [];

		this.doFilter().map(value => {
			var clash = this.props.checkClash(value.slot);
			var selected = this.props.checkSelected(value);
			
			if(selected) return selectedCourses.push(this.renderSelectedCard(value));
			else if(clash) return clashingCourses.push(this.renderClashCard(value));
			else return normalCourses.push(this.renderNormalCard(value));
		});

		var courses = normalCourses.concat(selectedCourses, clashingCourses)

		var applicableVenues = [];
		if (this.state.typeFilters.includes('Theory')) applicableVenues = [...applicableVenues, ...this.props.theoryVenues]
		if (this.state.typeFilters.includes('Lab')) applicableVenues = [...applicableVenues, ...this.props.labVenues]
		if (this.state.typeFilters.includes('Project')) applicableVenues = [...applicableVenues, ...this.props.projectVenues]
		if (this.state.typeFilters.length === 0) applicableVenues = this.props.venues;

		applicableVenues = Array.from(new Set(applicableVenues)).sort();

		var venueButtons = applicableVenues.map(v => {
			if(applicableVenues.length > 4)
				return <ToggleButton value={v} className='toggleCustom' size='sm'>{v}</ToggleButton>
			return <ToggleButton value={v} className='toggleCustom'>{v}</ToggleButton>
		});

		var typeButtons = this.props.types.map(v => {
			return <ToggleButton value={v} className='toggleCustom'>{v}</ToggleButton>
		});

		return (
			<Container className="slotTableContainer">
				<Card className="slotTableHeader">
					<Card.Header>
						<Row>
							<Col xs={12} sm={4}>
								<ToggleButtonGroup className="slotFilter"
									type='checkbox'
									value={this.state.typeFilters}
									onChange={this.handleTypeChange} >
									{typeButtons}
								</ToggleButtonGroup>
							</Col>
							
							<Col xs={12} sm={8} className="slotFilterContainer">
								<ToggleButtonGroup className="slotFilter"
									type='checkbox'
									value={this.state.venueFilters}
									onChange={this.handleVenueChange} >
									{venueButtons}
								</ToggleButtonGroup>
							</Col>
						</Row>
					</Card.Header>
				</Card>
				<Card className="slotTableBody">
						<CardColumns>
							{courses}
						</CardColumns>
				</Card>

			</Container>
		)
	}
}
export default SlotTable;