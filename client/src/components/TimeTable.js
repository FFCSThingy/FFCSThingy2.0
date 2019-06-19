import React, { Component } from "react";
import MediaQuery from 'react-responsive';
import { Container } from 'react-bootstrap';

import "./TimeTable.css";
class TimeTable extends Component {

	state = {
		skip: []
	}

	renderTTMobile = () => {
		return(
			<Container className="timetableContainer" fluid='true'>
			<table className="timetableA">
				<tbody className="timetableBody">
					{this.renderHeader1A()}
					{this.renderHeader1B()}
					{this.renderBodyA()}
				</tbody>
			</table>
			<table className="timetableB">
				<tbody className="timetableBody">
					{this.renderHeader2A()}
					{this.renderHeader2B()}
					{this.renderBodyB()}
				</tbody>
			</table>
			</Container>
		)
	}

	renderTTDesktop = () => {
		return(
			<Container className="timetableContainer" fluid='true'>
			<table className="timetableA">
			<tbody className="timetableBody">
				{this.renderHeader1()}
				{this.renderHeader2()}
				{this.renderBody()}
			</tbody>
			</table>
			</Container>
		)
	}
	
	renderTT = () => {
		<MediaQuery minDeviceWidth={768}>
			{(matches) => {
				if (matches) {
					this.renderTTDesktop()
				} else {
					this.renderTTMobile()
				}
			}}
		</MediaQuery>
	}

	renderHeader1 = () => {
		return(
			<tr className="timetableHeader1">
				<td className="timetableDay">THEORY<br/>HOURS
				</td>
				<td className="timetableTheoryHours">08:00 AM
					<br/>to
					<br/>08:50 AM
				</td>
				<td className="timetableTheoryHours">09:00 AM
					<br/>to
					<br/>09:50 AM
				</td>
				<td className="timetableTheoryHours">10:00 AM
					<br/>to
					<br/>10:50 AM
				</td>
				<td className="timetableTheoryHours">11:00 AM
					<br/>to
					<br/>11:50 AM
				</td>
				<td className="timetableTheoryHours">12:00 PM
					<br/>to
					<br/>12:50 PM
				</td>
				<td className="timetableTheoryHours"></td>
				<td widtd="8px" rowSpan={9} className="timetableDay">
					<strong>B
					<br/>R
					<br/>E
					<br/>A
					<br/>K</strong>
				</td>
				<td className="timetableTheoryHours">02:00 PM
					<br/>to
					<br/>02:50 PM
				</td>
				<td className="timetableTheoryHours">03:00 PM
					<br/>to
					<br/>03:50 PM
				</td>
				<td className="timetableTheoryHours">04:00 PM
					<br/>to
					<br/>04:50 PM
				</td>
				<td className="timetableTheoryHours">05:00 PM
					<br/>to
					<br/>05:50 PM
				</td>
				<td className="timetableTheoryHours">06:00 PM
					<br/>to
					<br/>06:50 PM
				</td>
				<td className="timetableTheoryHours">07:00 PM
					<br/>to
					<br/>07:50 PM
				</td>
			</tr>
		)
	}

	renderHeader2 = () => {
		return (
			<tr className="timetableHeader2">
				<td className="timetableDay">LAB
					<br/>HOURS
				</td>
				<td className="timetableLabHours">08:00 AM
					<br/>to
					<br/>08:45 AM
				</td>
				<td className="timetableLabHours">08:45 AM
					<br/>to
					<br/>09:30 AM
				</td>
				<td className="timetableLabHours">10:00 AM
					<br/>to
					<br/>10:45 AM
				</td>
				<td className="timetableLabHours">10:45 AM
					<br/>to
					<br/>11:30 AM
				</td>
				<td className="timetableLabHours">11:30 AM
					<br/>to
					<br/>12:15 AM
				</td>
				<td className="timetableLabHours">12:15 AM
					<br/>to
					<br/>01:00 PM
				</td>
				<td className="timetableLabHours">02:00 PM
					<br/>to
					<br/>02:45 PM
				</td>
				<td className="timetableLabHours">02:45 PM
					<br/>to
					<br/>03:30 PM
				</td>
				<td className="timetableLabHours">04:00 PM
					<br/>to
					<br/>04:45 PM
				</td>
				<td className="timetableLabHours">04:45 PM
					<br/>to
					<br/>05:30 PM
				</td>
				<td className="timetableLabHours">05:30 PM
					<br/>to
					<br/>06:15 PM
				</td>
				<td className="timetableLabHours">06:15 PM
					<br/>to
					<br/>07:00 PM
				</td>
			</tr>
		)
	}

	renderHeader1A = () => {
		return(
			<tr className="timetableHeader1A">
				<td className="timetableDay">THEORY<br/>HOURS
				</td>
				<td className="timetableTheoryHours">08:00 AM
					<br/>to
					<br/>08:50 AM
				</td>
				<td className="timetableTheoryHours">09:00 AM
					<br/>to
					<br/>09:50 AM
				</td>
				<td className="timetableTheoryHours">10:00 AM
					<br/>to
					<br/>10:50 AM
				</td>
				<td className="timetableTheoryHours">11:00 AM
					<br/>to
					<br/>11:50 AM
				</td>
				<td className="timetableTheoryHours">12:00 PM
					<br/>to
					<br/>12:50 PM
				</td>
				<td className="timetableTheoryHours"></td>
			</tr>
			)
		}
	
	renderHeader1B = () => {
		return(
			<tr className="timetableHeader1B">
				<td className="timetableTheoryHours">02:00 PM
					<br/>to
					<br/>02:50 PM
				</td>
				<td className="timetableTheoryHours">03:00 PM
					<br/>to
					<br/>03:50 PM
				</td>
				<td className="timetableTheoryHours">04:00 PM
					<br/>to
					<br/>04:50 PM
				</td>
				<td className="timetableTheoryHours">05:00 PM
					<br/>to
					<br/>05:50 PM
				</td>
				<td className="timetableTheoryHours">06:00 PM
					<br/>to
					<br/>06:50 PM
				</td>
				<td className="timetableTheoryHours">07:00 PM
					<br/>to
					<br/>07:50 PM
				</td>
			</tr>
		)
	}

	renderHeader2A = () => {
		return (
			<tr className="timetableHeader2A">
				<td className="timetableDay">LAB
					<br/>HOURS
				</td>
				<td className="timetableLabHours">08:00 AM
					<br/>to
					<br/>08:45 AM
				</td>
				<td className="timetableLabHours">08:45 AM
					<br/>to
					<br/>09:30 AM
				</td>
				<td className="timetableLabHours">10:00 AM
					<br/>to
					<br/>10:45 AM
				</td>
				<td className="timetableLabHours">10:45 AM
					<br/>to
					<br/>11:30 AM
				</td>
				<td className="timetableLabHours">11:30 AM
					<br/>to
					<br/>12:15 AM
				</td>
				<td className="timetableLabHours">12:15 AM
					<br/>to
					<br/>01:00 PM
				</td>
			</tr>
			)
		}
	renderHeader2B =() => {
		return(
			<tr className="timetableHeader2B">
				<td className="timetableLabHours">02:00 PM
					<br/>to
					<br/>02:45 PM
				</td>
				<td className="timetableLabHours">02:45 PM
					<br/>to
					<br/>03:30 PM
				</td>
				<td className="timetableLabHours">04:00 PM
					<br/>to
					<br/>04:45 PM
				</td>
				<td className="timetableLabHours">04:45 PM
					<br/>to
					<br/>05:30 PM
				</td>
				<td className="timetableLabHours">05:30 PM
					<br/>to
					<br/>06:15 PM
				</td>
				<td className="timetableLabHours">06:15 PM
					<br/>to
					<br/>07:00 PM
				</td>
			</tr>
		)
	}

	renderRow = (row) => {
		var elems = row.map((c,i) => {
			if(i === 0) return this.renderDays(c);

			var slots = c.split('/');
			var slotString, reqdCourse;

			if (slots[0] === '') slotString = slots[1];
			else if (slots[1] === '') slotString = slots[0];
			else slotString = c;


			if (!this.props.filledSlots.includes(slots[0]) && !this.props.filledSlots.includes(slots[1]))
				return this.renderEmpty(c, slotString);
			else if (this.props.filledSlots.includes(slots[0])) {
				
				reqdCourse = this.props.timetable.find(e => (
					e.slot.split('+').includes(slots[0]) && 
					e.timetableName === this.props.activeTimetable
				));
				
				return this.renderFilledTheory(c, slotString, reqdCourse);
			}
			else if (this.props.filledSlots.includes(slots[1])) {
				reqdCourse = this.props.timetable.find(e => (
					e.slot.split('+').includes(slots[1]) &&
					e.timetableName === this.props.activeTimetable
				));

				return this.renderFilledLab(c, slotString, reqdCourse);		
			}
		})
		
		return(
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
				<b>{slotString}</b> <br />
				{reqdCourse.code} <br />
				{reqdCourse.venue} <br />
				{reqdCourse.course_type}
			</td>
		)
	}

	renderFilledLab = (c, slotString, reqdCourse) => {
		return (
			<td key={c} className="timetableFilledLab">
				<b>{slotString}</b> <br />
				{reqdCourse.code} <br />
				{reqdCourse.venue} <br />
				{reqdCourse.course_type}
			</td>
		)
	}

	renderBody = () => {
			var slots = [
			['MON', 'A1/L1', 'F1/L2', 'D1/L3', 'TB1/L4', 'TG1/L5', '/L6', 'A2/L31', 'F2/L32', 'D2/L33', 'TB2/L34', 'TG2/L35', 'V3/L36'],
			['TUE', 'B1/L7', 'G1/L8', 'E1/L9', 'TC1/L10', 'TAA1/L11', '/L12', 'B2/L37', 'G2/L38', 'E2/L39', 'TC2/L40', 'TAA2/L41', 'V4/L42'],
			['WED', 'C1/L13', 'A1/L14', 'F1/L15', 'V1/L16', 'V2/', 'EXTM/', 'C2/L43', 'A2/L44', 'F2/L45', 'TD2/L46', 'TBB2/L47', 'V5/L48'],
			['THU', 'D1/L19', 'B1/L20', 'G1/L21', 'TE1/L22', 'TCC1/L23', '/L24', 'D2/L49', 'B2/L50', 'G2/L51', 'TE2/L52', 'TCC2/L53', 'V6/L54'],
			['FRI', 'E1/L25', 'C1/L26', 'TA1/L27', 'TF1/L28', 'TD1/L29', '/L30', 'E2/L55', 'C2/L56', 'TA2/L57', 'TF2/L58', 'TDD2/L59', 'V7/L60']
		];

	renderBodyA = () => {
		var slots = [
			['MON', 'A1/L1', 'F1/L2', 'D1/L3', 'TB1/L4', 'TG1/L5', '/L6'],
			['TUE', 'B1/L7', 'G1/L8', 'E1/L9', 'TC1/L10', 'TAA1/L11', '/L12'],
			['WED', 'C1/L13', 'A1/L14', 'F1/L15', 'V1/L16', 'V2/', 'EXTM/'],
			['THU', 'D1/L19', 'B1/L20', 'G1/L21', 'TE1/L22', 'TCC1/L23','/L24'],
			['FRI', 'E1/L25', 'C1/L26', 'TA1/L27', 'TF1/L28', 'TD1/L29', '/L30'] 
		];

		var rows = slots.map(row => this.renderRow(row));

		return rows;
	}

	renderBodyB = () => {
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
		return (		 
							{this.renderTT()}
					);
				}
				
export default TimeTable;