import React, { useState, useEffect, memo, FC } from 'react';
import {
	Card, CardColumns, Col, Container, Form, Row, Nav, ToggleButton, ToggleButtonGroup, OverlayTrigger, Tooltip,
} from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';

import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import styles from '../css/CourseSelectTable.module.scss';

import useAxiosFFCS from '../hooks/useAxiosFFCS';

import * as COURSE from '../constants/Courses';

import { Curriculum, CurriculumCourse } from '../models/Curriculum';

interface FilterControls {
	typeFilters: string[];
	tabsDisabled: boolean;
	setSelectedCategory: Function;
	setSearchString: Function;
	setTypeFilters: Function;
	setCreditFilter: Function;
	showPlaceholder: boolean;
}

const FilterControls: FC<FilterControls> = memo(
	({
		setSelectedCategory, setSearchString, typeFilters, setTypeFilters, setCreditFilter, tabsDisabled, showPlaceholder,
	}) => {
		const typeButtons = COURSE.simpleTypes.map((v) => (
			<ToggleButton
				value={v}
				className={styles.courseSelectTypeFilter}
				size="sm"
				key={`CourseSelect-CourseFilterToggleButton-${v}`}
			>
				{v}
			</ToggleButton>
		));

		const renderText = () => {
			if (showPlaceholder) { return <div className={styles.codeText} />; }
			return <></>;
		};

		return (
			<Container className={`${styles.searchBarContainer} fluid`}>
				<Row>
					<Col className={styles.searchColumn} xs={12} md={12}>
						<FaSearch className={styles.searchIcon} />
						<OverlayTrigger
							key="SearchBar-Overlay"
							placement="top"
							trigger={['hover', 'focus']}
							overlay={(
								<Tooltip id="CourseSelectTable_SearchBarTooltip">
									<table className={styles.searchTooltip}>
										<thead>
											<tr>
												<th>Prefix</th>
												<th>Search By</th>
											</tr>
										</thead>
										<tbody>
											<tr>
												<td>*</td>
												<td>Faculty</td>
											</tr>
										</tbody>
									</table>
								</Tooltip>
							)}
						>
							<Form.Control
								className={styles.searchBar}
								name="searchString"
								type="text"
								placeholder="Search by"
								spellCheck="false"
								autoComplete="off"
								onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchString(e.target.value)}
							/>
						</OverlayTrigger>
						{renderText()}
					</Col>
				</Row>

				<Row>
					<Col xs={6} md={5} lg={6} className={styles.typeFilterCol}>
						<ToggleButtonGroup
							className={styles.typeFilter}
							type="checkbox"
							value={typeFilters}
							onChange={(v: string[]) => setTypeFilters(v)}
						>
							{typeButtons}
						</ToggleButtonGroup>
					</Col>

					<Col xs={6} md={7} lg={6} className={styles.creditFilterCol}>
						<Form.Group as={Row} className={styles.creditFormGroup}>
							<Col xs={6} sm={5} md={7} lg={5}>
								<Form.Label className={styles.creditLabel}>Credits:</Form.Label>
							</Col>

							<Col xs={6} sm={7} md={5} lg={7}>
								<Form.Control
									className={styles.creditField}
									name="creditFilter"
									type="number"
									min="0"
									max="30"
									spellCheck="false"
									autoComplete="off"
									onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCreditFilter(e.target.value)}
								/>
							</Col>
						</Form.Group>
					</Col>
				</Row>

				<Row style={{ padding: '2vh 2vh 0.95px 2vh' }}>
					<Nav
						className={styles.categoryFilterGroup}
						variant="tabs"
						defaultActiveKey="ALL"
						onSelect={(selected: string) => setSelectedCategory(selected)}
					>
						<Nav.Item>
							<Nav.Link className={styles.categoryFilterButton} eventKey="ALL">ALL</Nav.Link>
						</Nav.Item>
						<Nav.Item>
							<Nav.Link className={styles.categoryFilterButton} eventKey="PC" disabled={tabsDisabled}>PC</Nav.Link>
						</Nav.Item>
						<Nav.Item>
							<Nav.Link className={styles.categoryFilterButton} eventKey="UC" disabled={tabsDisabled}>UC</Nav.Link>
						</Nav.Item>
						<Nav.Item>
							<Nav.Link className={styles.categoryFilterButton} eventKey="PE" disabled={tabsDisabled}>PE</Nav.Link>
						</Nav.Item>
						<Nav.Item>
							<Nav.Link className={styles.categoryFilterButton} eventKey="UE" disabled={tabsDisabled}>UE</Nav.Link>
						</Nav.Item>
					</Nav>
				</Row>
			</Container>
		);
	}
);

interface CourseReqs {
	prereq?: string;
	antireq?: string;
	coreq?: string;
}

interface CourseCard {
	code: string;
	title: string;
	credits: number;
	shortCourseTypes: string[];
	completed?: string;
	selected: boolean;
	prereqs: CourseReqs;
	doSelectCourse: Function;
}

interface PrereqText {
	value: string;
}

const CourseCard: FC<CourseCard> = memo(
	({
		code, title, credits, shortCourseTypes, completed = '', selected = false, prereqs = null, doSelectCourse,
	}) => {
		const cardClass = selected ? `${styles.courseCard} ${styles.active}` : styles.courseCard;
		const completionClass = ['N', 'F'].includes(completed) ? styles.cardCompletionFailedSubtitle : styles.cardCompletedSubtitle;

		const creditText = (credits === 1) ? 'Credit' : 'Credits';

		const valueMap = (value: string) => value.split(',').map((v) => (
			<>
				{v}
				<br />
			</>
		));

		const CoreqText: FC<PrereqText> = ({ value }) => {
			if (value) {
				return (
					<>
						<b>Co-Requisites: </b>
						{valueMap(value)}
						<br />
					</>
				);
			}
			return <></>;
		};

		const PrereqText: FC<PrereqText> = ({ value }) => {
			if (value) {
				return (
					<>
						<b>Pre-Requisites: </b>
						{valueMap(value)}
						<br />
					</>
				);
			}
			return <></>;
		};
		const AntireqText: FC<PrereqText> = ({ value }) => {
			if (value) {
				return (
					<>
						<b>Anti-Requisites: </b>
						{valueMap(value)}
						<br />
					</>
				);
			}
			return <></>;
		};

		const PrereqsTooltip = () => {
			if (prereqs) {
				return (
					<div className={styles.coursePrereq}>
						<PrereqText value={prereqs.prereq || ''} />
						<CoreqText value={prereqs.coreq || ''} />
						<AntireqText value={prereqs.antireq || ''} />
					</div>
				);
			}
			return <></>;
		};

		const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
			doSelectCourse(e.currentTarget.title);
		};

		return (
			<OverlayTrigger
				key={`${code}-Prereq-Overlay`}
				placement="top-start"
				trigger={['hover', 'focus']}
				overlay={(
					<Tooltip id={`${code}-PrereqsTooltip`}>
						<PrereqsTooltip />
						<div className={styles.courseTypes}>
							<b> Course Type: </b>
							{shortCourseTypes.join(' | ')}
						</div>
					</Tooltip>
				)}
			>
				<Card
					className={cardClass}
					onClick={handleClick}
					title={code}	// For using with handleClick
				>
					<Card.Body>
						<Card.Title className={styles.cardTitle}>
							{title}
						</Card.Title>

						<Card.Text className={styles.courseSelectDetails}>
							<span className={styles.courseCodeText}>
								{code}
							</span>

							<span className={styles.courseCredits}>
								{`${credits} ${creditText}`}
							</span>
						</Card.Text>

						<Card.Subtitle className={completionClass}>
							{
								(completed)
									? (`Completed: ${completed}`) : ''
							}
						</Card.Subtitle>
					</Card.Body>
				</Card>
			</OverlayTrigger>
		);
	}
);

interface CourseList {
	[key: string]: {
		credits: number;
		title: string;
		types: string[];
		simpleCourseTypes: string[];
		shortCourseTypes: string[];
	};
}

interface PrereqList {
	[key: string]: CourseReqs;
}

interface CourseCardList {
	filteredCourseList: CourseList;
	selectedCourse: string;
	prereqList: PrereqList;
	completedCourses: {
		[key: string]: string;
	};
	doSelectCourse: Function;
}

const CourseCardList: FC<CourseCardList> = ({
	filteredCourseList = {}, selectedCourse, doSelectCourse, prereqList, completedCourses,
}) => {
	const completedCourseCards = Object.keys(filteredCourseList)
		.filter((code) => completedCourses && completedCourses[code])
		.map((code) => {
			const { title, credits, shortCourseTypes } = filteredCourseList[code];

			return (
				<CourseCard
					code={code}
					title={title}
					credits={credits}
					shortCourseTypes={shortCourseTypes}
					selected={(selectedCourse === code)}
					completed={completedCourses[code]}
					prereqs={prereqList[code]}
					doSelectCourse={doSelectCourse}
					key={`${code}-CourseCard`}
				/>
			);
		});

	const normalCards = Object.keys(filteredCourseList)
		.filter((code) => !completedCourses || (completedCourses && !completedCourses[code]))
		.map((code) => {
			const { title, credits, shortCourseTypes } = filteredCourseList[code];

			return (
				<CourseCard
					code={code}
					title={title}
					credits={credits}
					shortCourseTypes={shortCourseTypes}
					selected={(selectedCourse === code)}
					prereqs={prereqList[code]}
					doSelectCourse={doSelectCourse}
					key={`${code}-CourseCard`}
				/>
			);
		});

	return (
		<CardColumns className={styles.courseList}>
			{normalCards}
			{completedCourseCards}
		</CardColumns>
	);
};


interface CourseSlotList {
	[key: string]: string[];
}

interface CourseFacultyList {
	[key: string]: string[];
}

interface CourseTypeList {
	[key: string]: string[];
}

interface CourseSelectTable {
	selectedCurriculum: Curriculum;
	selectedCurriculumPrefix: string;
	selectedCourse: string;
	completedCourses: {
		[key: string]: string;
	};
	doSelectCourse: Function;
}

const CourseSelectTable: FC<CourseSelectTable> = ({
	selectedCurriculum, selectedCurriculumPrefix, selectedCourse, completedCourses, doSelectCourse,
}) => {
	const [{ data: allCourseLists }, executeGetAllCourseLists] = useAxiosFFCS({
		url: '/course/allCourseLists',
	}, { manual: true });

	useEffect(() => {
		executeGetAllCourseLists();
	}, [executeGetAllCourseLists]);

	const [courseList, setCourseList] = useState<CourseList>({});
	const [courseFacultyList, setCourseFacultyList] = useState<CourseFacultyList>({});
	const [courseSlotList, setCourseSlotList] = useState<CourseSlotList>({});
	const [courseTypeList, setCourseTypeList] = useState<CourseTypeList>({});
	const [prereqList, setPrereqList] = useState<PrereqList>({});

	const [filteredCourseList, setFilteredCourseList] = useState<CourseList>({});

	useEffect(() => {
		if (allCourseLists) {
			setCourseList(allCourseLists.data.courseList);
			setFilteredCourseList(allCourseLists.data.courseList);
			setCourseFacultyList(allCourseLists.data.courseFacultyList);
			setCourseSlotList(allCourseLists.data.courseSlotList);
			setCourseTypeList(allCourseLists.data.courseTypeList);
			setPrereqList(allCourseLists.data.prerequisites);
		}
	}, [allCourseLists]);

	const [searchString, setSearchString] = useState('');
	const [typeFilters, setTypeFilters] = useState<string[]>([]);
	const [creditFilter, setCreditFilter] = useState('');

	const [selectedCategory, setSelectedCategory] = useState('ALL');
	const [tabsDisabled, setTabsDisabled] = useState(true);

	useEffect(() => {
		// $& means the whole matched string
		const escapeRegExp = (string: string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

		let searchBySlots = false;
		let searchByFaculty = false;
		let filteredCourses = courseList;
		let filteredCodes = Object.keys(courseList) || [];

		if (selectedCategory !== 'ALL' && Object.keys(selectedCurriculum).length) {
			const category = selectedCategory.toLowerCase();
			const curriculumCodes = (selectedCurriculum[category] as CurriculumCourse[])
				.map((c) => c.code);

			filteredCodes = filteredCodes
				.filter((code) => curriculumCodes.includes(code));
		}

		const search = escapeRegExp(searchString.toUpperCase().trim());
		const searchStringSlots = search.split('\\+');

		// Default, no filtering
		if (['', '*'].includes(search)
			&& typeFilters.length === 0
			&& [0, ''].includes(creditFilter)
			&& selectedCategory === 'ALL'
		) {
			setFilteredCourseList(filteredCourses);
			return;
		}

		searchBySlots = searchStringSlots
			.reduce((a, v) => (a && COURSE.validSlots.includes(v)), true)
			&& search.length > 0;

		searchByFaculty = search.startsWith('\\*');

		if (searchBySlots) {
			const reqdSlotCodes = Array.from(
				new Set(
					Object.keys(courseSlotList)
						.filter((slot) => searchStringSlots
							.every((s) => slot.replace(' ', '').split('+').includes(s))
						)
						.flatMap((s: string) => courseSlotList[s]),
				),
			);

			filteredCodes = filteredCodes
				.filter((code) => reqdSlotCodes.includes(code));
		} else if (searchByFaculty) {
			// Remove all instances of *. Removes the "\*" string

			// eslint-disable-next-line no-useless-escape
			const tempSearchString = search.replace('\\\*', '');

			const reqdFacultyCodes = Array.from(new Set(
				Object.keys(courseFacultyList)
					.filter((f) => f.includes(tempSearchString))
					.flatMap((f) => courseFacultyList[f]),
			));

			filteredCodes = filteredCodes
				.filter((code) => reqdFacultyCodes.includes(code));
		} else {
			filteredCodes = Array.from(new Set(
				filteredCodes
					.filter((code) => (
						courseList[code].title.toUpperCase().search(search) !== -1
						|| code.toUpperCase().search(search) !== -1
					)),
			));
		}

		// +creditFilter converts creditFilter to a number
		if (creditFilter !== '' && +creditFilter > 0) {
			filteredCodes = Array.from(new Set(
				filteredCodes
					.filter((code) => {
						if (courseList[code].credits === Number(creditFilter)) return true;
						return false;
					}),
			));
		}

		if (typeFilters.length > 0) {
			const reqdTypeCodes = Array.from(new Set(
				Object.keys(courseTypeList)
					.filter((f) => typeFilters.includes(f))
					.flatMap((f) => courseTypeList[f]),
			));

			filteredCodes = filteredCodes
				.filter((code) => reqdTypeCodes.includes(code));
		}

		filteredCourses = Object.keys(courseList).sort()
			.filter((code) => filteredCodes.includes(code))
			.reduce((acc, code) => ({ ...acc, [code]: courseList[code] }), {});

		setFilteredCourseList(filteredCourses);
	}, [courseList, courseTypeList, courseSlotList, courseFacultyList, searchString, creditFilter, typeFilters, selectedCategory, selectedCurriculum, selectedCurriculumPrefix]);

	useEffect(() => {
		if (!selectedCurriculum || Object.keys(selectedCurriculum).length === 0 || selectedCurriculumPrefix === 'Curriculum') {
			setTabsDisabled(true);
		} else {
			setTabsDisabled(false);
		}
	}, [selectedCurriculumPrefix, selectedCurriculum]);

	return (
		<Card className={styles.courseSelectContainer}>
			<Card.Header className={styles.courseSelectTableHeader}>
				<FilterControls
					tabsDisabled={tabsDisabled}
					showPlaceholder={!searchString}
					typeFilters={typeFilters}

					setSelectedCategory={setSelectedCategory}
					setSearchString={setSearchString}
					setTypeFilters={setTypeFilters}
					setCreditFilter={setCreditFilter}
				/>
			</Card.Header>
			<Card.Body className={styles.courseSelectTableBody}>
				<CourseCardList
					filteredCourseList={filteredCourseList}
					selectedCourse={selectedCourse}
					prereqList={prereqList}
					completedCourses={completedCourses}

					doSelectCourse={doSelectCourse}
				/>
			</Card.Body>
		</Card>
	);
};

export default CourseSelectTable;
