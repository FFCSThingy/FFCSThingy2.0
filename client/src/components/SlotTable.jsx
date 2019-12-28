import React, { Component } from 'react';

import {
	Card, Col, CardColumns, Container, ToggleButtonGroup, ToggleButton, Row,
} from 'react-bootstrap';

import '../css/SlotTable.scss';

class SlotTable extends Component {
	constructor(props) {
		super(props);
		this.state = {
			typeFilters: [],
			venueFilters: [],
			courseTypes: [],
		};
	}

	componentDidUpdate(nextProps) {
		if (nextProps.selectedCourse !== this.props.selectedCourse) {
			this.doResetState();
			this.findAvailableCourseTypes();
		}
	}

	doFilter = () => this.props.slots.filter((course) => {	// Filter on course_type
		if (this.state.typeFilters.length === 0) return true;
		return this.state.typeFilters.reduce((a, v) => (a || (course.simpleCourseType === v)), false);
	}).filter((course) => {	// Filter on Venue
		if (this.state.venueFilters.length === 0) return true;
		if (this.state.typeFilters.includes('Project') && course.simpleCourseType === 'Project') return true;
		return this.state.venueFilters.reduce((a, v) => (a || (course.venue.startsWith(v))), false);
	});

	findAvailableCourseTypes = () => {
		const courseTypes = Array.from(
			new Set(this.props.slots.map((course) => course.simpleCourseType)),
		).sort();

		this.setState({ courseTypes });
	}

	handleTypeChange = (value) => {
		this.setState({ typeFilters: value });
	}

	handleVenueChange = (value) => {
		this.setState({ venueFilters: value });
	}

	doResetState() {
		this.setState({
			typeFilters: [],
			venueFilters: [],
		});
	}

	renderNormalCard(value) {
		return (
			<Card
				className="cardContainer"
				key={value._id}
				onClick={() => this.props.selectSlots(value)}
			>

				<Card.Body className="cardBody">
					<Card.Text>{value.slot}</Card.Text>
					<Card.Title>{value.faculty}</Card.Title>
					<Card.Subtitle className="cardSubtitle">
						{`${value.venue} - ${value.course_type}`}
					</Card.Subtitle>

					<Card.Subtitle className="cardSubtitle">
						{'Popularity - '}
						<b>
							{`${Math.floor(value.percent)}%`}
						</b>
					</Card.Subtitle>
				</Card.Body>

			</Card>
		);
	}

	renderClashCard = (value, clashingSlots) => {
		const clashingString = clashingSlots.join(', ');
		return (
			<Card
				className="cardContainer"
				key={value._id}
			>

				<Card.Body className="cardBodyClash">
					<Card.Text>{value.slot}</Card.Text>
					<Card.Title>{value.faculty}</Card.Title>
					<Card.Subtitle className="cardSubtitle">
						{`${value.venue} - ${value.course_type}`}
					</Card.Subtitle>
					<Card.Subtitle className="cardSubtitle">
						{'Popularity - '}
						<b>
							{`${Math.floor(value.percent)}%`}
						</b>
					</Card.Subtitle>
					<Card.Subtitle className="cardClashSubtitle">
						{'Clashes with '}
						<b>{clashingString}</b>
					</Card.Subtitle>
				</Card.Body>

			</Card>
		);
	}

	renderSelectedCard = (value) => (
		<Card
			className="cardContainer"
			key={value._id}
		>

			<Card.Body className="cardBodySelected">
				<Card.Text>{value.slot}</Card.Text>
				<Card.Title>{value.faculty}</Card.Title>
				<Card.Subtitle className="cardSubtitle">
					{'Popularity - '}
					<b>
						{`${Math.floor(value.percent)}%`}
					</b>
				</Card.Subtitle>
				<Card.Subtitle className="cardSubtitle">
					{`${value.venue} - ${value.course_type}`}
					<Card.Subtitle className="cardSelectedSubtitle">Selected</Card.Subtitle>
				</Card.Subtitle>
			</Card.Body>

		</Card>
	)

	render() {
		const normalCourses = [];
		const selectedCourses = [];
		const clashingCourses = [];

		this.doFilter().map((value) => {
			const clashingSlots = this.props.checkClash(value.slot);
			const doesClash = clashingSlots && clashingSlots.length > 0;
			const selected = this.props.checkSelected(value);

			if (selected) return selectedCourses.push(this.renderSelectedCard(value));
			if (doesClash) return clashingCourses.push(this.renderClashCard(value, clashingSlots));
			return normalCourses.push(this.renderNormalCard(value));
		});

		const courses = normalCourses.concat(selectedCourses, clashingCourses);

		let applicableVenues = [];
		if (this.state.typeFilters.includes('Theory')) applicableVenues = [...applicableVenues, ...this.props.theoryVenues];
		if (this.state.typeFilters.includes('Lab')) applicableVenues = [...applicableVenues, ...this.props.labVenues];
		if (this.state.typeFilters.includes('Project')) applicableVenues = [...applicableVenues, ...this.props.projectVenues];
		if (this.state.typeFilters.length === 0) applicableVenues = this.props.venues;

		applicableVenues = Array.from(new Set(applicableVenues)).sort();

		const venueButtons = applicableVenues.map((v) => {
			if (applicableVenues.length > 4) { return <ToggleButton value={v} className="toggleCustom" size="sm">{v}</ToggleButton>; }
			return <ToggleButton value={v} className="toggleCustom">{v}</ToggleButton>;
		});

		const typeButtons = this.state.courseTypes.map((v) => <ToggleButton value={v} className="toggleCustom">{v}</ToggleButton>);

		return (
			<Container className="slotTableContainer">
				<Card className="slotTableHeader">
					<Card.Header>
						<Row>
							<Col xs={12} sm={4}>
								<ToggleButtonGroup
									className="slotFilter"
									type="checkbox"
									value={this.state.typeFilters}
									onChange={this.handleTypeChange}
								>
									{typeButtons}
								</ToggleButtonGroup>
							</Col>

							<Col xs={12} sm={8} className="slotFilterContainer">
								<ToggleButtonGroup
									className="slotFilter"
									type="checkbox"
									value={this.state.venueFilters}
									onChange={this.handleVenueChange}
								>
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
		);
	}
}
export default SlotTable;
