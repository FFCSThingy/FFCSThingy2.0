import React, { useState, useEffect } from 'react';

import {
	Card, Col, CardColumns, ToggleButtonGroup, ToggleButton, Row,
} from 'react-bootstrap';

import styles from '../css/SlotTable.module.scss';
import '../css/CustomToggleButton.scss';

const SlotCard = ({
	slotDetails, onClick, type, clashingSlots,
}) => {
	let clashSubtitle; let selectedSubtitle; let
		cardBodyClass = styles.cardBody;
	if (type === 'clashing' && clashingSlots) {
		const clashingString = clashingSlots.join(', ');
		cardBodyClass = styles.cardBodyClash;
		clashSubtitle = (
			<Card.Subtitle className={styles.cardClashSubtitle}>
				{'Clashes with '}
				<b>{clashingString}</b>
			</Card.Subtitle>
		);
	}
	if (type === 'selected') {
		cardBodyClass = styles.cardBodySelected;
		selectedSubtitle = (
			<Card.Subtitle className={styles.cardSelectedSubtitle}>Selected</Card.Subtitle>
		);
	}

	return (
		<Card
			className={styles.slotCard}
			key={slotDetails._id}
			onClick={() => ((type === 'normal' && onClick) ? onClick(slotDetails) : null)}
		>

			<Card.Body className={cardBodyClass}>
				<Card.Text>{slotDetails.slot}</Card.Text>
				<Card.Title>{slotDetails.faculty}</Card.Title>
				<Card.Subtitle className={styles.cardSubtitle}>
					{`${slotDetails.venue} - ${slotDetails.course_type}`}
				</Card.Subtitle>

				<Card.Subtitle className={styles.cardSubtitle}>
					{'Popularity - '}
					<b>
						{`${Math.floor(slotDetails.percent)}%`}
					</b>
				</Card.Subtitle>

				{
					(type === 'clashing' && clashingSlots)
						? clashSubtitle
						: null
				}

				{
					(type === 'selected' ? selectedSubtitle : null)
				}

			</Card.Body>

		</Card>
	);
};

const SlotTable = ({
	selectedCourseCode, selectedCourseSlots, addSlotToTimetable, slotClashesWith, isSelected,
}) => {
	const [selectedCourseTypes, setSelectedCourseTypes] = useState([]);
	const [typeFilters, setTypeFilters] = useState([]);
	const [venueFilters, setVenueFilters] = useState([]);
	const [allAvailableVenueList, setAllAvailableVenueList] = useState([]);
	const [theoryAvailableVenueList, setTheoryAvailableVenueList] = useState([]);
	const [labAvailableVenueList, setLabAvailableVenueList] = useState([]);
	const [projectAvailableVenueList, setProjectAvailableVenueList] = useState([]);
	const [filteredSlots, setFilteredSlots] = useState(selectedCourseSlots);

	// Reset filters and update lists when selectedCourseCode changes.
	useEffect(() => {
		const types = Array.from(
			new Set(selectedCourseSlots.map((course) => course.simpleCourseType)),
		).sort();

		const findAvailableVenues = (type = null) => {
			const venueRegex = /^[A-Z]+/;
			return Array.from(
				new Set(
					selectedCourseSlots
						.filter((c) => !(c.venue === 'NIL'))
						.filter((c) => {
							if (type) return c.simpleCourseType === type;
							return true;
						})
						.map((course) => {
							const s = course.venue.match(venueRegex)[0];
							if (s.endsWith('G')) return s.slice(0, -1);
							return s;
						}),
				),
			).sort();
		};

		setSelectedCourseTypes(types);

		setAllAvailableVenueList(findAvailableVenues());
		setTheoryAvailableVenueList(findAvailableVenues('Theory'));
		setLabAvailableVenueList(findAvailableVenues('Lab'));
		setProjectAvailableVenueList(findAvailableVenues('Project'));

		setTypeFilters([]);
		setVenueFilters([]);

		// setFilteredSlots(selectedCourseSlots);
	}, [selectedCourseCode, selectedCourseSlots]);

	useEffect(() => {
		const doCourseSlotsFilter = () => selectedCourseSlots
			.filter((course) => {	// Filter on simpleCourseType
				if (typeFilters.length === 0) { return true; }

				return typeFilters.reduce((a, v) => (a || (course.simpleCourseType === v)), false);
			}).filter((course) => {	// Filter on Venue
				if (venueFilters.length === 0) { return true; }

				if (
					typeFilters.includes('Project')
					&& course.simpleCourseType === 'Project'
				) return true;

				return venueFilters.reduce((a, v) => (a || (course.venue.startsWith(v))), false);
			});

		setFilteredSlots(doCourseSlotsFilter());
	}, [typeFilters, venueFilters, selectedCourseSlots]);

	const handleTypeChange = (val) => setTypeFilters(val);

	const handleVenueChange = (val) => setVenueFilters(val);

	const normalCourses = [];
	const selectedCourses = [];
	const clashingCourses = [];

	filteredSlots.map((slot) => {
		if (isSelected(slot)) {
			return selectedCourses.push(
				<SlotCard
					slotDetails={slot}
					type="selected"
				/>,
			);
		}

		const clashingSlots = slotClashesWith(slot.slot);
		if (clashingSlots.length > 0) {
			return clashingCourses.push(
				<SlotCard
					slotDetails={slot}
					type="clashing"
					clashingSlots={clashingSlots}
				/>,
			);
		}

		return normalCourses.push(
			<SlotCard
				slotDetails={slot}
				type="normal"
				onClick={addSlotToTimetable}
			/>,
		);
	});

	const courses = normalCourses.concat(selectedCourses, clashingCourses);

	let applicableVenues = [];
	if (typeFilters.includes('Theory')) applicableVenues = [...applicableVenues, ...theoryAvailableVenueList];
	if (typeFilters.includes('Lab')) applicableVenues = [...applicableVenues, ...labAvailableVenueList];
	if (typeFilters.includes('Project')) applicableVenues = [...applicableVenues, ...projectAvailableVenueList];
	if (typeFilters.length === 0) applicableVenues = allAvailableVenueList;

	applicableVenues = Array.from(new Set(applicableVenues)).sort();

	const venueButtons = applicableVenues.map((v) => {
		if (applicableVenues.length > 4) {
			return <ToggleButton value={v} className="toggleCustom" size="sm">{v}</ToggleButton>;
		}
		return <ToggleButton className="toggleCustom" value={v}>{v}</ToggleButton>;
	});

	const typeButtons = selectedCourseTypes.map((v) => <ToggleButton value={v} className="toggleCustom">{v}</ToggleButton>);

	return (
		<Card className={styles.slotTableContainer}>
			<Card.Header className={styles.slotTableHeader}>
				<Row>
					<Col xs={12} sm={4}>
						<ToggleButtonGroup
							className={styles.slotFilter}
							type="checkbox"
							value={typeFilters}
							onChange={handleTypeChange}
						>
							{typeButtons}
						</ToggleButtonGroup>
					</Col>

					<Col xs={12} sm={8} className={styles.slotFilterContainer}>
						<ToggleButtonGroup
							className={styles.slotFilter}
							type="checkbox"
							value={venueFilters}
							onChange={handleVenueChange}
						>
							{venueButtons}
						</ToggleButtonGroup>
					</Col>
				</Row>
			</Card.Header>

			<Card.Body className={styles.slotTableBody}>
				<CardColumns>
					{courses}
				</CardColumns>
			</Card.Body>

		</Card>
	);
};

export default SlotTable;
