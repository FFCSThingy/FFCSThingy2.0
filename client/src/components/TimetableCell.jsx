import React, { Component } from "react";
import MediaQuery from 'react-responsive';
import { Container, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FaSun } from 'react-icons/fa';

import "../css/TimeTable.css";
class TimetableCell extends Component { 
	static defaultProps = {
		filled: false,
		lab: false,
		day: false,
		time: false,
		slotString: '',
		dayString: '',
		timeString: ''
	}

	renderTime = () => {
		var cellClass = (this.props.lab) ? 'timetableLabHours' : 'timetableTheoryHours';
		return <td className={cellClass}>{this.props.timeString}</td>
	}

	renderDay = () => {
		return <td key={this.props.dayString} className="timetableDay">{this.props.dayString}</td>
	}

	renderEmpty = () => {
		return <td key={this.props.slotString} className="timetableEmpty"><b>{this.props.slotString}</b></td>
	}

	renderFilled = () => {
		var cellClass = (this.props.lab) ? 'timetableFilledLab' : 'timetableFilledTheory';
		return (
			<td key={this.props.slotString} className={cellClass}>
				<OverlayTrigger
					key={`${this.props.slotString}-Overlay`}
					placement="top"
					trigger={['hover', 'click']}
					overlay={
						<Tooltip>
							<h6 className="courseDetails">
								<b>{this.props.reqdCourse.title}</b> <br />
								{this.props.reqdCourse.faculty} <br />
								{this.props.reqdCourse.slot}
							</h6>
						</Tooltip>
					}
				>
					<div>
						<b className="slotDetails">{this.props.slotString}</b>
						<h6 className="courseCode">{this.props.reqdCourse.code}</h6>
						<h6 className="courseDetails">{this.props.reqdCourse.venue} - {this.props.reqdCourse.course_type}</h6>
					</div>
				</OverlayTrigger>
			</td>
		)
	}

	render() {
		if(this.props.day) return this.renderDay();
		if(this.props.time) return this.renderTime();
		
		return (this.props.filled) ? this.renderFilled() : this.renderEmpty();
	}
}

export default TimetableCell;