import React, { Component } from 'react';
import MediaQuery from 'react-responsive';
import { Container } from 'react-bootstrap';
import { FaSun } from 'react-icons/fa';
import TimetableCell from './TimetableCell';

import { SLOTS, HEADERS } from '../constants/Timetable';

import '../css/TimeTable.css';

class Timetable extends Component {
	constructor(props) {
		super(props);
		this.state = {
			skip: [],
		};
	}

	renderTTMobile = () => (
		<Container className="timetableContainer">
			<FaSun className="morningIcon" size="2x" color="yellow" />
			<table className="timetableA">
				<tbody className="timetableBody">
					<tr className="timetableHeader1A">
						{this.renderHeaderRow(HEADERS[0], true, true, true)}
					</tr>

					<tr className="timetableHeader2A">
						{this.renderHeaderRow(HEADERS[1], true, true, false)}
					</tr>
					{this.renderMobileMorningBody()}
				</tbody>
			</table>

			<FaSun className="eveningIcon" size="2x" />
			<table className="timetableB">
				<tbody className="timetableBody">
					<tr className="timetableHeader1B">
						{this.renderHeaderRow(HEADERS[0], true, false, true)}
					</tr>

					<tr className="timetableHeader2B">
						{this.renderHeaderRow(HEADERS[1], true, false, false)}
					</tr>
					{this.renderMobileAfternoonBody()}
				</tbody>
			</table>
		</Container>
	)

	renderTTDesktop = () => (
		<Container className="timetableContainer" fluid="true">
			<table className="timetableA">
				<tbody className="timetableBody">
					<tr className="timetableHeader1">
						{this.renderHeaderRow(HEADERS[0], false, false, true)}
					</tr>

					<tr className="timetableHeader2">
						{this.renderHeaderRow(HEADERS[1], false, false, false)}
					</tr>
					{this.renderDesktopBody()}
				</tbody>
			</table>
		</Container>
	)

	renderHeaderRow = (row, mobile = false, morning = false, row1 = true) => row.map((val, i) => {
		// Split at spaces, join with <br>
		const cellVal = val.split(' ').reduce((acc, v) => (acc === null ? <>{v}</> : (
			<>
				{acc}
				<br />
				{v}
			</>
		)), null);

		if (i === 0) return <TimetableCell dayHeader>{cellVal}</TimetableCell>;

		if (mobile) {
			if (morning && i > 6) return null;	// Only need first 7 cells for morning
			if (!morning && row1 && i < 8) return null;	// Only need cells after 8 for evening row1 (Because break cell)
			if (!morning && i < 7) return null;	// Only need cells after 7 for evening row2
		} else if (i === 7 && row1) return <TimetableCell isBreak>{cellVal}</TimetableCell>;

		return <TimetableCell timeHeader>{cellVal}</TimetableCell>;
	})

	findReqdCourse = (slots, lab = false) => this.props.timetable.find((e) => (
		e.slot.replace(' ', '').split('+').includes((lab) ? slots[1] : slots[0])
			&& e.timetableName === this.props.activeTimetable
	))

	renderRow = (row, mobile = false, morning = false) => {
		const elems = row.map((r, i) => {
			let slotString = r;

			if (i === 0) return <TimetableCell dayHeader>{slotString}</TimetableCell>;

			if (mobile && morning && i > 6) return null;
			if (mobile && !morning && i < 7) return null;

			const slots = r.split('/');
			const [theorySlot, labSlot] = slots;

			const reqdLabCourse = this.findReqdCourse(slots, true);	// Checks if current lab slot is filled
			const reqdTheoryCourse = this.findReqdCourse(slots, false);	// Checks if current theory slot is filled

			if (!labSlot) slotString = theorySlot;
			else if (!theorySlot) slotString = labSlot;

			if (this.props.filledSlots.includes(theorySlot) && reqdTheoryCourse) { // Is a theory slot
				return <TimetableCell reqdCourse={reqdTheoryCourse} isFilled>{slotString}</TimetableCell>;
			}

			if (this.props.filledSlots.includes(labSlot) && reqdLabCourse) { // Is a lab slot
				return <TimetableCell reqdCourse={reqdLabCourse} isFilled isLab>{slotString}</TimetableCell>;
			}

			return <TimetableCell>{slotString}</TimetableCell>;
		});

		return (
			<tr>
				{elems}
			</tr>
		);
	}

	renderDesktopBody = () => SLOTS.map((row) => this.renderRow(row));

	renderMobileMorningBody = () => SLOTS.map((row) => this.renderRow(row, true, true));

	renderMobileAfternoonBody = () => SLOTS.map((row) => this.renderRow(row, true, false));

	render() {
		return (
			<MediaQuery minDeviceWidth={768}>
				{(matches) => {
					if (matches) {
						return this.renderTTDesktop();
					}
					return this.renderTTMobile();
				}}
			</MediaQuery>
		);
	}
}

export default Timetable;
