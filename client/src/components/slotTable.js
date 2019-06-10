import React, { Component } from "react";
import axios from 'axios';
import './slotTable.css';

class SlotTable extends Component {
	state = {
		heatmap: [],
		timestamp: null || JSON.parse(localStorage.getItem('heatmapTimestamp')),
		error: null,
		currentCourses: [],
		course_type: [],
		venue: [],
	}
	componentWillMount() {
		axios.get("/course/getFullHeatmap")
			.then(res => {
				if (res.data.success) {
					if (res.status == 304)
						this.setState({ heatmap: JSON.parse(localStorage.getItem('heatmap')) })
					else {
						this.setState({ heatmap: res.data.data.heatmap });
						localStorage.setItem('heatmap', JSON.stringify(res.data.data.heatmap));
						localStorage.setItem('heatmapTimestamp', JSON.stringify(res.data.data.timestamp));
					}

				} else
					this.setState({ error: res.data.message })
			});
	}

	doFilter = () => {
		// Filter on Course-Code
		return this.state.heatmap.filter(course => {
			return course.code == this.props.selectedCourse
		}).filter(course => {	// Filter on course_type
			if (['TH', 'ETH', 'SS'].includes(course.course_type)) course.course_type = 'Theory'
			if (['LO', 'ELA'].includes(course.course_type)) course.course_type = 'Lab'
			if (['PJT', 'EPJ'].includes(course.course_type)) course.course_type = 'Project'

			if (this.state.course_type != []) {
				return this.state.course_type.reduce((a, v) => {
					console.log(a + ", " + v);
					return (a || (course.course_type === v));
				}, false);
			}
			return true;
		}).filter(course => {	// Filter on Venue
			if (this.state.venue.length === 0) return true;
			else if (this.state.course_type.includes('Project') && course.course_type === 'Project') return true;
			else return this.state.venue.reduce((a, v) => (a || (course.venue.startsWith(v))), false);
		});
	}


	handleAddedFilters = (e) => {
		var x = document.getElementById("selectedFilter");
		console.log(x);
		x.removeChild(e.target);
	}

	handleclick = (e) => {
		var x = document.getElementById("selectedFilter");
		var y = document.createElement("a");
		var text = e.target.textContent
		x.appendChild(y);
		y.textContent = e.target.textContent;
		y.href = "#";
		y.setAttribute("onClick", "{this.handleAddedFilters}");

		if (!this.state.course_type.includes(text)) {
			this.setState(prevState => ({
				course_type: [...prevState.course_type, text]
			}))
		}
	}


	handleClick = (e) => {
		var data = document.getElementById("data");
		if (data.className === "hide") {
			data.className = "show";
		}
		else {
			data.className = "hide";
		}
	}

	handleCross = (e) => {
		var data = document.getElementById("data");
		data.className = "hide";
	}

	handleVenues = (e) => {
		var x = document.getElementById("selectedFilter");
		var y = document.createElement("a");
		var text = e.target.textContent
		x.appendChild(y);
		y.textContent = e.target.textContent;
		y.href = "#";

		if (!this.state.venue.includes(text)) {
			this.setState(prevState => ({
				venue: [...prevState.venue, text]
			}))
		}
	}

	render() {
		var courses = this.doFilter().map(value => {
			return (
				<div className="slots" key={value._id} onClick={() => { this.props.fillSlots(value.slot, [value.slot, value.code, value.title, value.faculty, value.venue, value.credits, value._id]) }}>
					<h4>{value.slot}</h4>
					<h5>{value.faculty}</h5>
					<p>{value.venue} - {value.course_type}</p>
				</div>
			)
		})
		return (

			<div className="righttable">
				<div className="tiles">
					<button onClick={this.handleclick} className="notclicked">Lab</button>
					<button onClick={this.handleclick} className="notclicked">Theory</button>
					<button onClick={this.handleclick} className="notclicked">Project</button>
					<a href="#" id="venuefilter" onClick={this.handleClick}><span>Filter by Venue</span><i class="fas fa-filter" id="filter"></i></a>
					<div className="hide" id="data">
						<div className="venues">Venue Filters</div>
						<a href="#" onClick={this.handleVenues}><span>SJT</span></a>
						<a href="#" onClick={this.handleVenues}><span>TT</span></a>
						<a href="#" onClick={this.handleVenues}><span>GDN</span></a>
						<a href="#" onClick={this.handleVenues}><span>MB</span></a>
						<a href="#" onClick={this.handleVenues}><span>SMV</span></a>
						<a href="#" onClick={this.handleCross}><i class="material-icons" id="cross" >
							clear
                    </i></a>
					</div>
					<hr></hr>
					<div className="filtersAdded" id="selectedFilter">Filters Added:</div>
					<hr></hr>
				</div>

				{courses}

			</div>

		)
	}
}
export default SlotTable;