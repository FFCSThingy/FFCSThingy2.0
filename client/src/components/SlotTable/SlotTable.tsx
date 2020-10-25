import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
	Card, Col, CardColumns, ToggleButtonGroup, ToggleButton, Row,
} from 'react-bootstrap';

import SlotCard from './SlotCard';

import {
	selectSlotsForCourse,
	selectClashingSlots,
	checkSelected,
	checkRelated,
} from '../../selectors/slots';
import { selectSelectedCourse } from '../../selectors/course';
import { addCourse } from '../../reducers/timetable';

import styles from '../../css/SlotTable.module.scss';

import HeatmapCourse from '../../models/data/HeatmapCourse';

const SlotTable = () => {
	const dispatch = useDispatch();

	const selectedCourse = useSelector(selectSelectedCourse);
	const slots = useSelector(selectSlotsForCourse);

	// Custom Selectors
	const slotClashesWith = useSelector(selectClashingSlots);
	const isSelected = useSelector(checkSelected);
	const checkIsRelated = useSelector(checkRelated);

	const [selectedCourseTypes, setSelectedCourseTypes] = useState<string[]>([]);
	const [typeFilters, setTypeFilters] = useState<string[]>([]);
	const [venueFilters, setVenueFilters] = useState<string[]>([]);
	const [allAvailableVenueList, setAllAvailableVenueList] = useState<string[]>([]);
	const [theoryAvailableVenueList, setTheoryAvailableVenueList] = useState<string[]>([]);
	const [labAvailableVenueList, setLabAvailableVenueList] = useState<string[]>([]);
	const [projectAvailableVenueList, setProjectAvailableVenueList] = useState<string[]>([]);
	const [filteredSlots, setFilteredSlots] = useState<HeatmapCourse[]>(slots);

	// Reset filters and update lists when selectedCourse changes.
	useEffect(() => {
		const types = Array.from(
			new Set(slots.map((course) => course.simpleCourseType)),
		).sort();

		const findAvailableVenues = (type = '') => {
			const venueRegex = /^[A-Z]+/;
			return Array.from(
				new Set(
					slots
						.filter((c) => !(c.venue === 'NIL'))
						.filter((c) => {
							if (type) return c.simpleCourseType === type;
							return true;
						})
						.map((course) => {
							// const matches = course.venue.match(venueRegex);
							// const buildingString = matches? matches[0] : '';
							const buildingString = (course.venue.match(venueRegex) as RegExpMatchArray)[0];
							if (buildingString.endsWith('G')) return buildingString.slice(0, -1);
							return buildingString;
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
	}, [selectedCourse, slots]);

	useEffect(() => {
		const doCourseSlotsFilter = () => slots
			.filter((course) => {	// Filter on simpleCourseType
				if (typeFilters.length === 0) { return true; }

				return typeFilters
					.reduce<boolean>((a, v) => (a || (course.simpleCourseType === v)), false);
			}).filter((course) => {	// Filter on Venue
				if (venueFilters.length === 0) { return true; }

				if (
					typeFilters.includes('Project')
					&& course.simpleCourseType === 'Project'
				) { return true; }

				return venueFilters
					.reduce<boolean>((a, v) => (a || (course.venue.startsWith(v))), false);
			});

		setFilteredSlots(doCourseSlotsFilter());
	}, [typeFilters, venueFilters, slots]);

	const handleTypeChange = (val: string[]) => setTypeFilters(val);

	const handleVenueChange = (val: string[]) => setVenueFilters(val);

	const normalCourses: JSX.Element[] = [];
	const selectedCourses: JSX.Element[] = [];
	const clashingCourses: JSX.Element[] = [];

	filteredSlots.map((slot) => {
		const isRelated = checkIsRelated(slot);

		if (isSelected(slot)) {
			return selectedCourses.push(
				<SlotCard
					slotDetails={slot}
					type="selected"
					key={`SlotCard-${slot._id}`}
					isRelated={isRelated}
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
					key={`SlotCard-${slot._id}`}
					isRelated={isRelated}
				/>,
			);
		}

		return normalCourses.push(
			<SlotCard
				slotDetails={slot}
				type="normal"
				onClick={
					() => dispatch(addCourse({
						course: slot,
						timeEpoch: Date.now(),
					}))
				}
				key={`SlotCard-${slot._id}`}
				isRelated={isRelated}
			/>,
		);
	});

	const courses = normalCourses.concat(selectedCourses, clashingCourses);

	let applicableVenues: string[] = [];
	if (typeFilters.includes('Theory')) applicableVenues = [...applicableVenues, ...theoryAvailableVenueList];
	if (typeFilters.includes('Lab')) applicableVenues = [...applicableVenues, ...labAvailableVenueList];
	if (typeFilters.includes('Project')) applicableVenues = [...applicableVenues, ...projectAvailableVenueList];
	if (typeFilters.length === 0) applicableVenues = allAvailableVenueList;

	applicableVenues = Array.from(new Set(applicableVenues)).sort();

	const venueButtons = applicableVenues.map((v) => {
		if (applicableVenues.length > 4) {
			return <ToggleButton value={v} key={`SlotTable-VenueFilterToggleButton-${v}`} className={styles.venueFilterButton} size="sm">{v}</ToggleButton>;
		}
		return <ToggleButton key={`SlotTable-VenueFilterToggleButton-${v}`} className={styles.venueFilterButton} value={v}>{v}</ToggleButton>;
	});

	const typeButtons = selectedCourseTypes.map((v) => <ToggleButton value={v} key={`SlotTable-CourseFilterToggleButton-${v}`} className={styles.typeFilterButton}>{v}</ToggleButton>);

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
