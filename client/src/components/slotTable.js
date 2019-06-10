import React, { Component } from "react";
import axios from 'axios';
import './slotTable.css';

class SlotTable extends Component {

	state = {
		error: null,
		currentCourses: [],
		course_type: [],
		venue: [],
	}

	doFilter = () => {
		return this.props.slots.filter(course => {	// Filter on course_type
			if (this.state.course_type.length === 0)
				return this.state.course_type.reduce((a, v) => (a || (course.course_type === v)), false);
			return true;
		}).filter(course => {	// Filter on Venue
			if (this.state.venue.length === 0) return true;
			else if (this.state.course_type.includes('Project') && course.course_type === 'Project') return true;
			else return this.state.venue.reduce((a, v) => (a || (course.venue.startsWith(v))), false);
		});
	}



	handleclick = (e) => {
		var x = document.getElementById("selectedFilter");
		var y = document.createElement("a");
		var text = e.target.textContent
		x.appendChild(y);
		y.textContent = e.target.textContent;
		y.href = "#";

		if(e.target.className=="notclicked"){
			e.target.className="clicked";
		}
		else{
			e.target.className="notclicked";
		}
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


	// handleVenues = (e) => {
	// 	var x = document.getElementById("selectedFilter");
	// 	var y = document.createElement("a");
	// 	var text = e.target.textContent
	// 	x.appendChild(y);
	// 	y.textContent = e.target.textContent;
	// 	y.href = "#";

	// 	if (!this.state.venue.includes(text)) {
	// 		this.setState(prevState => ({
	// 			venue: [...prevState.venue, text]
	// 		}))
	// 	}
	// }

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
			<hr></hr>
				<span className="selectFilter">	Select Filters	</span>
			<hr></hr>
				<div className="tiles">
					<div className="courseType">
					<button onClick={this.handleclick} className="notclicked">Lab</button>
					<button onClick={this.handleclick} className="notclicked">Theory</button>
					<button onClick={this.handleclick} className="notclicked">Project</button>
					</div>
					<div className="venueFilter">
					<button onClick={this.handleclick} className="notclicked">SJT</button>
					<button onClick={this.handleclick} className="notclicked">TT</button>
					<button onClick={this.handleclick} className="notclicked">MB</button>
					<button onClick={this.handleclick} className="notclicked">SMV</button>
					<button onClick={this.handleclick} className="notclicked">GDN</button>
					<button onClick={this.handleclick} className="notclicked">CDMM</button>
					<button onClick={this.handleclick} className="notclicked">CBMR</button>
					<button onClick={this.handleclick} className="notclicked">LIB</button>
					</div>
					{/* <a href="#" id="venuefilter" onClick={this.handleClick}><span>Filter by Venue</span><i class="fas fa-filter" id="filter"></i></a>
					<div className="hide" id="data">
						<div className="venues">Venue Filters</div>
						<form>
							<label className="SJT">SJT:</label>
						<input type="checkbox" name="SJT" onClick={this.handleVenues}></input>
						<label className="TT">TT:</label>
						<input type="checkbox" name="TT" onClick={this.handleVenues}/>
						<label className="GDN">GDN:</label>
						<input type="checkbox" name="GDN" onClick={this.handleVenues}/>
						<label className="MB">MB</label>
						<input type="checkbox" name="MB" onClick={this.handleVenues}/>
						<label className="SMV">SMV</label>
						<input type="checkbox" name="SMV" onClick={this.handleVenues}/>
						<a href="#" onClick={this.handleVenues}><span>SJT</span></a>
						<a href="#" onClick={this.handleVenues}><span>TT</span></a>
						<a href="#" onClick={this.handleVenues}><span>GDN</span></a>
						<a href="#" onClick={this.handleVenues}><span>MB</span></a>
						<a href="#" onClick={this.handleVenues}><span>SMV</span></a>
						<a href="#" onClick={this.handleCross}><i class="material-icons" id="cross" >
							clear
                    </i></a>
					</form>
					</div> */}
					
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