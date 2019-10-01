import React, { Component } from "react";
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

import "../css/TimeTable.css";
class TimetableCell extends Component { 
	static defaultProps = {
		filled: false,
		lab: false,
		day: false,
		time: false,
		slotString: '',
	}

	renderBreak = () => {
		return <td width="8px" rowSpan={9} className="timetableBreak"><strong>{this.props.children}</strong></td>
	}

	renderTime = () => {
		var cellClass = (this.props.lab) ? 'timetableLabHours' : 'timetableTheoryHours';
		return <td key={this.props.children} className={cellClass}>{this.props.children}</td>
	}

	renderDay = () => {
		return <td key={this.props.children} className="timetableDay">{this.props.children}</td>
	}

	renderEmpty = () => {
		return <td key={this.props.children} className="timetableEmpty"><b>{this.props.children}</b></td>
	}

	renderFilled = () => {
		var cellClass = (this.props.lab) ? 'timetableFilledLab' : 'timetableFilledTheory';
		return (
			<td key={this.props.children} className={cellClass}>
				<OverlayTrigger
					key={`${this.props.children}-Overlay`}
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
						<b className="slotDetails">{this.props.children}</b>
						<h6 className="courseCode">{this.props.reqdCourse.code}</h6>
						<h6 className="courseDetails">{this.props.reqdCourse.venue} - {this.props.reqdCourse.course_type}</h6>
					</div>
				</OverlayTrigger>
			</td>
		)
	}

	render() {
		if(this.props.break) return this.renderBreak();
		if(this.props.day) return this.renderDay();
		if(this.props.time) return this.renderTime();
		
		return (this.props.filled) ? this.renderFilled() : this.renderEmpty();
	}
}

export default TimetableCell;