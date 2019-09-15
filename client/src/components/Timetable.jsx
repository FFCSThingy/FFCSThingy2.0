import React, { Component } from "react";
import MediaQuery from 'react-responsive';
import { Container, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FaSun } from 'react-icons/fa';

import "../css/TimeTable.css";
class Timetable extends Component {

	state = {
		skip: []
	}

	renderTTMobile = () => {
		return (
			<Container className="timetableContainer">
				<FaSun className="morningIcon" size="2x" color="yellow"></FaSun>
				<table className="timetableA">
					<tbody className="timetableBody">
						{this.renderMobileMorningHeader1()}
						{this.renderMobileMorningHeader2()}
						{this.renderMobileMorningBody()}
					</tbody>
				</table>

				<FaSun className="eveningIcon"size="2x"></FaSun>
				<table className="timetableB">
					<tbody className="timetableBody">
						{this.renderMobileAfternoonHeader1()}
						{this.renderMobileAfternoonHeader2()}
						{this.renderMobileAfternoonBody()}
					</tbody>
				</table>
			</Container>
		)
	}

	renderTTDesktop = () => {
		return (
			<Container className="timetableContainer" fluid='true'>
				<table className="timetableA">
					<tbody className="timetableBody">
						{this.renderDesktopHeader1()}
						{this.renderDesktopHeader2()}
						{this.renderDesktopBody()}
					</tbody>
				</table>
			</Container>
		)
	}

	renderTT = () => {
		return(
			<MediaQuery minDeviceWidth={768}>
				{(matches) => {
					if (matches) {
						return this.renderTTDesktop()
					} else {
						return this.renderTTMobile()
					}
				}}
			</MediaQuery>
		)
	}

	renderDesktopHeader1 = () => {
		return (
			<tr className="timetableHeader1">
				<td className="timetableDay">THEORY<br />HOURS
				</td>
				<td className="timetableTheoryHours">08:00
					
					<br />08:50
				</td>
				<td className="timetableTheoryHours">09:00
					
					<br />09:50
				</td>
				<td className="timetableTheoryHours">10:00
					
					<br />10:50
				</td>
				<td className="timetableTheoryHours">11:00
					
					<br />11:50
				</td>
				<td className="timetableTheoryHours">12:00
					
					<br />12:50
				</td>
				<td className="timetableTheoryHours"></td>
				<td widtd="8px" rowSpan={9} className="timetableBreak">
					<strong>B
					<br />R
					<br />E
					<br />A
					<br />K</strong>
				</td>
				<td className="timetableTheoryHours">02:00
					
					<br />02:50
				</td>
				<td className="timetableTheoryHours">03:00
					
					<br />03:50
				</td>
				<td className="timetableTheoryHours">04:00
					
					<br />04:50
				</td>
				<td className="timetableTheoryHours">05:00
					
					<br />05:50
				</td>
				<td className="timetableTheoryHours">06:00
					
					<br />06:50
				</td>
				<td className="timetableTheoryHours">07:00
					
					<br />07:50
				</td>
			</tr>
		)
	}

	renderDesktopHeader2 = () => {
		return (
			<tr className="timetableHeader2">
				<td className="timetableDay">LAB
					<br />HOURS
				</td>
				<td className="timetableLabHours">08:00
					
					<br />08:45
				</td>
				<td className="timetableLabHours">08:45
					
					<br />09:30
				</td>
				<td className="timetableLabHours">10:00
					
					<br />10:45
				</td>
				<td className="timetableLabHours">10:45
					
					<br />11:30
				</td>
				<td className="timetableLabHours">11:30
					
					<br />12:15
				</td>
				<td className="timetableLabHours">12:15
					
					<br />01:00
				</td>
				<td className="timetableLabHours">02:00
					
					<br />02:45
				</td>
				<td className="timetableLabHours">02:45
					
					<br />03:30
				</td>
				<td className="timetableLabHours">04:00
					
					<br />04:45
				</td>
				<td className="timetableLabHours">04:45
					
					<br />05:30
				</td>
				<td className="timetableLabHours">05:30
					
					<br />06:15
				</td>
				<td className="timetableLabHours">06:15
					
					<br />07:00
				</td>
			</tr>
		)
	}

	renderMobileMorningHeader1 = () => {
		return (
			<tr className="timetableHeader1A">
				<td className="timetableDay">THEORY<br />HOURS
				</td>
				<td className="timetableTheoryHours">08:00
					<br />08:50
				</td>
				<td className="timetableTheoryHours">09:00
					
					<br />09:50
				</td>
				<td className="timetableTheoryHours">10:00
					
					<br />10:50
				</td>
				<td className="timetableTheoryHours">11:00
					
					<br />11:50
				</td>
				<td className="timetableTheoryHours">12:00
					
					<br />12:50
				</td>
				<td className="timetableTheoryHours"></td>
			</tr>
		)
	}

	renderMobileAfternoonHeader1 = () => {
		return (
			<tr className="timetableHeader1B">
				<td className="timetableDay">THEORY<br />HOURS
				</td>
				<td className="timetableTheoryHours">02:00
					
					<br />02:50
				</td>
				<td className="timetableTheoryHours">03:00
					
					<br />03:50
				</td>
				<td className="timetableTheoryHours">04:00
					
					<br />04:50
				</td>
				<td className="timetableTheoryHours">05:00
					
					<br />05:50
				</td>
				<td className="timetableTheoryHours">06:00
					
					<br />06:50
				</td>
				<td className="timetableTheoryHours">07:00
					
					<br />07:50
				</td>
			</tr>
		)
	}

	renderMobileMorningHeader2 = () => {
		return (
			<tr className="timetableHeader2A">
				<td className="timetableDay">LAB<br />HOURS
				</td>
				<td className="timetableLabHours">08:00
					
					<br />08:45
				</td>
				<td className="timetableLabHours">08:45
					
					<br />09:30
				</td>
				<td className="timetableLabHours">10:00
					
					<br />10:45
				</td>
				<td className="timetableLabHours">10:45
					
					<br />11:30
				</td>
				<td className="timetableLabHours">11:30
					
					<br />12:15
				</td>
				<td className="timetableLabHours">12:15
					
					<br />01:00
				</td>
			</tr>
		)
	}
	renderMobileAfternoonHeader2 = () => {
		return (
			<tr className="timetableHeader2B">
				<td className="timetableDay">LAB<br />HOURS
				</td>
				<td className="timetableLabHours">02:00
					
					<br />02:45
				</td>
				<td className="timetableLabHours">02:45
					
					<br />03:30
				</td>
				<td className="timetableLabHours">04:00
					
					<br />04:45
				</td>
				<td className="timetableLabHours">04:45
					
					<br />05:30
				</td>
				<td className="timetableLabHours">05:30
					
					<br />06:15
				</td>
				<td className="timetableLabHours">06:15
					
					<br />07:00
				</td>
			</tr>
		)
	}

	renderRow = (row) => {
		var elems = row.map((c, i) => {
			if (i === 0) return this.renderDays(c);

			var slots = c.split('/');
			var slotString, reqdCourse;

			if (slots[0] === '') slotString = slots[1];
			else if (slots[1] === '') slotString = slots[0];
			else slotString = c;


			if (!this.props.filledSlots.includes(slots[0]) && !this.props.filledSlots.includes(slots[1])) {
				return this.renderEmpty(c, slotString);
			} else if (this.props.filledSlots.includes(slots[0])) {		// Is a theory slot
				
				reqdCourse = this.props.timetable.find(e => (
					e.slot.split('+').includes(slots[0]) &&
					e.timetableName === this.props.activeTimetable
				));
        
				if (!reqdCourse) 
					return this.renderEmpty(c, slotString);
				
				return this.renderFilledTheory(c, slotString, reqdCourse);
			} else if (this.props.filledSlots.includes(slots[1])) {		// Is a lab slot
				
				reqdCourse = this.props.timetable.find(e => (
					e.slot.split('+').includes(slots[1]) &&
					e.timetableName === this.props.activeTimetable
				));

				if (!reqdCourse) 
					return this.renderEmpty(c, slotString);

				return this.renderFilledLab(c, slotString, reqdCourse);		
			}
		});

		return (
			<tr>
				{elems}
			</tr>
		)
	}

	renderDays = (day) => {
		return <td key={day} className="timetableDay">{day}</td>
	}

	renderEmpty = (c, slotString) => {
		return <td key={c} className="timetableEmpty"><b>{slotString}</b></td>
	}

	renderFilledTheory = (c, slotString, reqdCourse) => {
		return (
			<td key={c} className="timetableFilledTheory">
				<OverlayTrigger
					key={ `${c}-Overlay` }
					placement="top"
					overlay={
						<Tooltip>
							<h6 className="courseDetails">
								<b>{reqdCourse.title}</b> <br/>
								{reqdCourse.faculty} <br/>
								{reqdCourse.slot}
							</h6>
						</Tooltip>
					}
				>
					<div>
						<b className="slotDetails">{slotString}</b>
						<h6 className="courseCode">{reqdCourse.code}</h6>
						<h6 className="courseDetails">{reqdCourse.venue}-{reqdCourse.course_type}</h6>
					</div>
				</OverlayTrigger>
			</td>
		)
	}

	renderFilledLab = (c, slotString, reqdCourse) => {
		return (
			<td key={c} className="timetableFilledLab">
				<OverlayTrigger
					key={ `${c}-Overlay`}
					placement="top"
					overlay={
						<Tooltip>
							<h6 className="courseDetails">
								<b>{reqdCourse.title}</b> <br />
								{reqdCourse.faculty} <br />
								{reqdCourse.slot}
							</h6>
						</Tooltip>
					}
				>
					<div>
						<b className="slotDetails">{slotString}</b>
						<h6 className="courseCode">{reqdCourse.code}</h6>
						<h6 className="courseDetails">{reqdCourse.venue}-{reqdCourse.course_type}</h6>
					</div>
				</OverlayTrigger>
			</td>
		)
	}

	renderDesktopBody = () => {
		var slots = [
			['MON', 'A1/L1', 'F1/L2', 'D1/L3', 'TB1/L4', 'TG1/L5', '/L6', 'A2/L31', 'F2/L32', 'D2/L33', 'TB2/L34', 'TG2/L35', 'V3/L36'],
			['TUE', 'B1/L7', 'G1/L8', 'E1/L9', 'TC1/L10', 'TAA1/L11', '/L12', 'B2/L37', 'G2/L38', 'E2/L39', 'TC2/L40', 'TAA2/L41', 'V4/L42'],
			['WED', 'C1/L13', 'A1/L14', 'F1/L15', 'V1/L16', 'V2/', 'EXTM/', 'C2/L43', 'A2/L44', 'F2/L45', 'TD2/L46', 'TBB2/L47', 'V5/L48'],
			['THU', 'D1/L19', 'B1/L20', 'G1/L21', 'TE1/L22', 'TCC1/L23', '/L24', 'D2/L49', 'B2/L50', 'G2/L51', 'TE2/L52', 'TCC2/L53', 'V6/L54'],
			['FRI', 'E1/L25', 'C1/L26', 'TA1/L27', 'TF1/L28', 'TD1/L29', '/L30', 'E2/L55', 'C2/L56', 'TA2/L57', 'TF2/L58', 'TDD2/L59', 'V7/L60']
		];

		var rows = slots.map(row => this.renderRow(row));

		return rows;
	}

	renderMobileMorningBody = () => {
		var slots = [
			['MON', 'A1/L1', 'F1/L2', 'D1/L3', 'TB1/L4', 'TG1/L5', '/L6'],
			['TUE', 'B1/L7', 'G1/L8', 'E1/L9', 'TC1/L10', 'TAA1/L11', '/L12'],
			['WED', 'C1/L13', 'A1/L14', 'F1/L15', 'V1/L16', 'V2/', 'EXTM/'],
			['THU', 'D1/L19', 'B1/L20', 'G1/L21', 'TE1/L22', 'TCC1/L23', '/L24'],
			['FRI', 'E1/L25', 'C1/L26', 'TA1/L27', 'TF1/L28', 'TD1/L29', '/L30']
		];

		var rows = slots.map(row => this.renderRow(row));

		return rows;
	}

	renderMobileAfternoonBody = () => {
		var slots = [
			['MON', 'A2/L31', 'F2/L32', 'D2/L33', 'TB2/L34', 'TG2/L35', 'V3/L36'],
			['TUE', 'B2/L37', 'G2/L38', 'E2/L39', 'TC2/L40', 'TAA2/L41', 'V4/L42'],
			['WED', 'C2/L43', 'A2/L44', 'F2/L45', 'TD2/L46', 'TBB2/L47', 'V5/L48'],
			['THU', 'D2/L49', 'B2/L50', 'G2/L51', 'TE2/L52', 'TCC2/L53', 'V6/L54'],
			['FRI', 'E2/L55', 'C2/L56', 'TA2/L57', 'TF2/L58', 'TDD2/L59', 'V7/L60']
		];

		var rows = slots.map(row => this.renderRow(row));

		return rows;
	}

	render() {
		return this.renderTT();
	}

}

export default Timetable;