import React, { Component } from "react";
import axios from 'axios';
import './slotTable.css';

class SlotTable extends Component {

	state = {
		error: null,
		currentCourses: [],
		typeFilters: [],
		venueFilters: [],
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

	handleTypeClick = (e) => {
		var text = e.target.textContent
		if (e.target.className == "notclicked") {
			e.target.className = "clicked";
			if (!this.state.typeFilters.includes(text)) {
				this.setState(prevState => ({
					typeFilters: [...prevState.typeFilters, text]
				}))
			}
		} else {
			e.target.className = "notclicked";
			this.setState(prevState => ({
				typeFilters: prevState.typeFilters.filter(v => (v !== text))
			}));
		}
	}

	handleVenueClick = (e) => {
		var text = e.target.textContent
		if (e.target.className == "notclicked") {
			e.target.className = "clicked";
			if (!this.state.venueFilters.includes(text)) {
				this.setState(prevState => ({
					venueFilters: [...prevState.venueFilters, text]
				}))
			}
		} else {
			e.target.className = "notclicked";
			this.setState(prevState => ({
				venueFilters: prevState.venueFilters.filter(v => (v !== text))
			}));
		}
	}

	render() {
		var courses = this.doFilter().map(value => {
			return (
				<div className="slots" key={value._id} onClick={() => this.props.selectSlots(value)}>
					<h4>{value.slot}</h4>
					<h5>{value.faculty}</h5>
					<p>{value.venue} - {value.course_type}</p>
				</div>
			)
		});

		var applicableVenues = [];
		if (this.state.typeFilters.includes('Theory')) applicableVenues = [...applicableVenues, ...this.props.theoryVenues]
		if (this.state.typeFilters.includes('Lab')) applicableVenues = [...applicableVenues, ...this.props.labVenues]
		if (this.state.typeFilters.includes('Project')) applicableVenues = [...applicableVenues, ...this.props.projectVenues]
		if (this.state.typeFilters.length === 0) applicableVenues = this.props.venues;


		var venueButtons = Array.from(new Set(applicableVenues)).sort().map(v => {
			var initClass;
			if (this.state.venueFilters.includes(v)) initClass = 'clicked';
			else initClass = 'notclicked';

			return <button onClick={this.handleVenueClick} className={initClass}>{v}</button>
		});

		var LTPButtons = this.props.types.map(v => {
			var initClass;
			if (this.state.typeFilters.includes(v)) initClass = 'clicked';
			else initClass = 'notclicked';

			return <button onClick={this.handleTypeClick} className={initClass}>{v}</button>
		});

		return (

			<div className="righttable">
				<hr></hr>
				<span className="selectFilter">Select Filters</span>
				<hr></hr>
				<div className="tiles">
					<div className="courseType">
						{LTPButtons}
					</div>
					<div className="venueFilter">
						{venueButtons}
					</div>

					<hr></hr>
					<div className="hide">
						<div className="filtersAdded" id="selectedFilter"></div>
					</div>
				</div>
				<div className="slotsFiltered">
					{courses}
				</div>
			</div>

		)
	}
}
export default SlotTable;