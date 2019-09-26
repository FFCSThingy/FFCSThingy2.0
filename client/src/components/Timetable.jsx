import React, { Component } from "react";
import MediaQuery from 'react-responsive';
import { Container } from 'react-bootstrap';
import { FaSun } from 'react-icons/fa';
import TimetableCell from './TimetableCell';

import { SLOTS } from '../constants/Slots';

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

				<FaSun className="eveningIcon" size="2x"></FaSun>
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
				<td width="8px" rowSpan={9} className="timetableBreak">
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

	findReqdCourse = (slots, lab=false) => {
		return this.props.timetable.find(e => (
			e.slot.replace(' ', '').split('+').includes((lab) ? slots[1] : slots[0]) &&
			e.timetableName === this.props.activeTimetable
		));
	}

	renderRow = (row, mobile=false, morning=false) => {
		var elems = row.map((c, i) => {
			if (i === 0) return <TimetableCell dayString={c} day />;

			if(mobile && morning && i > 6) return null;
			if (mobile && !morning && i < 7) return null;

			var slots = c.split('/');
			var reqdLabSlot = this.findReqdCourse(slots, true);
			var reqdTheorySlot = this.findReqdCourse(slots, false);
			var slotString;

			if (slots[0] === '') slotString = slots[1];
			else if (slots[1] === '') slotString = slots[0];
			else slotString = c;

			if (this.props.filledSlots.includes(slots[0]) && reqdTheorySlot) // Is a theory slot
				return <TimetableCell slotString={slotString} reqdCourse={reqdTheorySlot} filled />

			else if (this.props.filledSlots.includes(slots[1]) && reqdLabSlot)	// Is a lab slot
				return <TimetableCell slotString={slotString} reqdCourse={reqdLabSlot} filled lab />

			else
				return <TimetableCell slotString={slotString} />
		});

		return (
			<tr>
				{elems}
			</tr>
		)
	}

	renderDesktopBody = () => SLOTS.map(row => this.renderRow(row));

	renderMobileMorningBody = () => SLOTS.map(row => this.renderRow(row, true, true));

	renderMobileAfternoonBody = () => SLOTS.map(row => this.renderRow(row, true, false));

	render() {
		return this.renderTT();
	}

}

export default Timetable;