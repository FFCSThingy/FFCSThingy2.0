import React from 'react';
import { Card, CardColumns, Col, Container, Form, Row, Nav, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../css/CourseSelectTable.css';
import { FaSearch } from 'react-icons/fa';

import * as COURSE from '../constants/Courses';

class CourseSelectTable extends React.Component {
	state = {
		selectedCategory: 'ALL',
		searchString: '',
		filteredCourses: [],
		error: null,
		typeFilters: [],
		creditFilter: '',
		searchByFaulty: false,
	}

	componentWillMount() {

	}

	handleChange = (event) => {
		let fieldName = event.target.name;
		let fleldVal = event.target.value;
		this.setState({ [fieldName]: fleldVal })

		if (event.target.name === 'searchString') this.doSearch();
	}

	handleTypeChange = (value, event) => {
		this.setState({ typeFilters: value });
	}

	doSearch() {
		var searchString = this.state.searchString.toUpperCase();
		var filteredCourses = this.props.courseList;

		if (searchString === '' && this.state.typeFilters.length === 0 && [0, ''].includes(this.state.creditFilter))
			return filteredCourses;

		if (searchString.endsWith('+')) searchString = searchString.substring(0, searchString.length - 1)

		var searchBySlots = true;

		var slots_title = new Set(["A1", "A2", "B1", "B2", "C1", "C2", "D1", "D2", "E1", "E2", "F1", "F2", "G1", "G2", "L1", "L10", "L11", "L12", "L13", "L14", "L15", "L16", "L19", "L2", "L20", "L21", "L22", "L23", "L24", "L25", "L26", "L27", "L28", "L29", "L3", "L30", "L31", "L32", "L33", "L34", "L35", "L36", "L37", "L38", "L39", "L4", "L40", "L41", "L42", "L43", "L44", "L45", "L46", "L47", "L48", "L49", "L5", "L50", "L51", "L52", "L53", "L54", "L55", "L56", "L57", "L58", "L59", "L6", "L60", "L7", "L71", "L72", "L73", "L74", "L75", "L76", "L77", "L78", "L79", "L8", "L80", "L81", "L82", "L83", "L84", "L85", "L86", "L87", "L88", "L89", "L9", "L90", "L91", "L92", "L93", "L94", "TA1", "TA2", "TAA1", "TAA2", "TB1", "TB2", "TBB2", "TC1", "TC2", "TCC1", "TCC2", "TD1", "TD2", "TDD2", "TE1", "TE2", "TF1", "TF2", "TG1", "TG2", "V1", "V10", "V11", "V2", "V3", "V4", "V5", "V6", "V7", "V8", "V9", "W2", "X1", "X2", "Y1", "Y2", "Z", ""]);

		if (searchString === "")
			searchBySlots = false;
		else
			searchBySlots = true;

		var searchStringSlots = searchString.toUpperCase().split("+");

		searchBySlots = searchStringSlots.reduce((a, v) => (a && slots_title.has(v)), searchBySlots);

		var filteredCodes = [];
		if (searchBySlots) {
			filteredCodes = this.props.heatmap.filter(v => {
				return searchStringSlots.every(c => v.slot.replace(' ', '').split('+').includes(c));
			}).map(v => v.code);
		} else {
			filteredCodes = this.props.heatmap.filter(v => (v.title.toUpperCase().search(searchString) !== -1 || v.code.toUpperCase().search(searchString) !== -1)).map(v => v.code)
		}

		
		
		filteredCourses = this.props.courseList.filter(v => {	// Filter based on search
			return filteredCodes.includes(v.code);
		});

		filteredCourses = this.doTypeFilter(filteredCourses);
		filteredCourses = this.doCreditFilter(filteredCourses);

		filteredCourses.sort();
		filteredCourses.sort(function (a, b) {
			return b.title.indexOf(searchString) - a.title.indexOf(searchString) + b.code.indexOf(searchString) - a.code.indexOf(searchString);
		});

		return filteredCourses;
	}

	renderText = () => {
		if (!this.state.searchString)
			return <div className="codeText"></div>;
		else
			return;
	}

	checkTheory = (course) => course.types.filter(type => COURSE.isTheoryType(type)).length > 0;

	checkLab = (course) => course.types.filter(type => COURSE.isLabType(type)).length > 0;

	checkProject = (course) => course.types.filter(type => COURSE.isProjectType(type)).length > 0;

	doTypeFilter = (courses) => {
		return courses.filter(course => {	// Filter on course_type
			if (this.state.typeFilters.length === 0) return true;

			if (this.state.typeFilters.includes('Theory') && this.state.typeFilters.includes('Lab') && this.state.typeFilters.includes('Project'))
				return this.checkTheory(course) && this.checkLab(course) && this.checkProject(course);


			else if (this.state.typeFilters.includes('Theory') && this.state.typeFilters.includes('Lab'))
				return this.checkTheory(course) && this.checkLab(course) && !this.checkProject(course);

			else if (this.state.typeFilters.includes('Theory') && this.state.typeFilters.includes('Project'))
				return this.checkTheory(course) && !this.checkLab(course) && this.checkProject(course);

			else if (this.state.typeFilters.includes('Project') && this.state.typeFilters.includes('Lab'))
				return !this.checkTheory(course) && this.checkLab(course) && this.checkProject(course);


			else if (this.state.typeFilters.includes('Theory'))
				return this.checkTheory(course) && !this.checkLab(course) && !this.checkProject(course);
			else if (this.state.typeFilters.includes('Lab'))
				return !this.checkTheory(course) && this.checkLab(course) && !this.checkProject(course);
			else if (this.state.typeFilters.includes('Project'))
				return !this.checkTheory(course) && !this.checkLab(course) && this.checkProject(course);
		});
	}

	doCreditFilter = (courses) => {
		return courses.filter(course => {
			if (this.state.creditFilter <= 0 || this.state.creditFilter === '') return true;
			if (course.credits === Number(this.state.creditFilter)) return true;
			return false;
		});
	}

	renderSearchBar() {
		var tabsDisabled = true;

		if (!this.props.curriculum || this.props.selectedCurriculum === 'Curriculum'
			|| Object.keys(this.props.curriculum).length === 0) {
			tabsDisabled = true;
		}
		else tabsDisabled = false;

		var typeButtons = COURSE.simpleTypes.map(v =>
			<ToggleButton value={v} className='toggleCustom' size='sm'>{v}</ToggleButton>);

		return (
			<Container className="searchBarContainer" fluid={true}>
				<Row>
					<Col className="searchColumn" xs={12} md={12}>
						<FaSearch className="searchIcon"></FaSearch>
						<Form.Control
							className="searchBar"
							name='searchString'
							type='text'
							placeholder='Search by'
							spellCheck='false'
							autoComplete='off'
							defaultValue={this.state.searchString}
							onChange={this.handleChange.bind(this)}
						/>
						{this.renderText()}
					</Col>
				</Row>

				<Row>
					<Col xs={6} md={6} className="typeFilterCol">
						<ToggleButtonGroup className="typeFilter"
							type='checkbox'
							value={this.state.typeFilters}
							onChange={this.handleTypeChange} >
							{typeButtons}
						</ToggleButtonGroup>
					</Col>

					<Col xs={6} md={6}>
						<Form.Group as={Row} className="creditFormGroup">
							<Col sm={5}>
								<Form.Label className="creditLabel">Credits:</Form.Label>
							</Col>

							<Col sm={7}>
								<Form.Control
									column sm={4}
									className="creditField"
									name='creditFilter'
									type='number'
									min='0'
									max='30'
									spellCheck='false'
									autoComplete='off'
									defaultValue={this.state.creditFilter}
									onChange={this.handleChange.bind(this)}
								/>
							</Col>
						</Form.Group>

						{/* <Form.Control
							column sm={4}
							className="creditField"
							name='creditFilter'
							type='number'
							min='0'
							max='30'
							placeholder='Credits'
							spellCheck='false'
							autoComplete='off'
							defaultValue={this.state.creditFilter}
							onChange={this.handleChange.bind(this)}
						/> */}
					</Col>
				</Row>

				<Row style={{ 'padding': '2vh 2vh 0.95px 2vh' }}>
					<Nav className="courseTypeFilter"
						variant="tabs"
						defaultActiveKey='ALL'
						onSelect={selected => this.setState({ selectedCategory: selected })}
					>
						<Nav.Item>
							<Nav.Link className="filterButton" eventKey='ALL'>ALL</Nav.Link>
						</Nav.Item>
						<Nav.Item>
							<Nav.Link className="filterButton" eventKey='PC' disabled={tabsDisabled}>PC</Nav.Link>
						</Nav.Item>
						<Nav.Item>
							<Nav.Link className="filterButton" eventKey='UC' disabled={tabsDisabled}>UC</Nav.Link>
						</Nav.Item>
						<Nav.Item>
							<Nav.Link className="filterButton" eventKey='PE' disabled={tabsDisabled}>PE</Nav.Link>
						</Nav.Item>
						<Nav.Item>
							<Nav.Link className="filterButton" eventKey='UE' disabled={tabsDisabled}>UE</Nav.Link>
						</Nav.Item>
					</Nav>
				</Row>
			</Container>
		)
	}

	renderNormalCard(value) {
		var className = "courseCard";
		if (value.code === this.props.selectedCourse) className = "courseCard active";

		var typeString = new Set();
		if (value.types.filter(type => COURSE.isLabType(type)).length > 0) typeString.add('L');
		if (value.types.filter(type => COURSE.isProjectType(type)).length > 0) typeString.add('P');
		if (value.types.filter(type => COURSE.isTheoryType(type)).length > 0) typeString.add('T');


		return (
			<div className="courses" key={value.code} onClick={() => this.props.selectCourse(value.code)}>
				<CardColumns className="courseList">
					<Card className={className}>
						<Card.Body>
							<Card.Title>{value.title}</Card.Title>
							<Card.Text className="courseSelectDetails">
								<div className="courseCodeText">{value.code}</div>
								<div className="courseTypes"> <b> {Array.from(typeString).join(' | ')} </b> </div>
								<div className="courseCredits">{value.credits} Credit{(value.credits == 1)?'':'s'}</div>
							</Card.Text>
							<Card.Subtitle className="cardCompletedSubtitle">
								{
									(this.props.completedCourses[value.code]) ?
										('Completed: ' + this.props.completedCourses[value.code]) : ''
								}
							</Card.Subtitle>
						</Card.Body>
					</Card>
				</CardColumns>
			</div>
		)
	}

	renderCourses() {
		var list = this.doSearch();

		var completed = [], normal = [];

		if (this.state.selectedCategory !== 'ALL' && Object.keys(this.props.curriculum).length) {
			var cat = this.state.selectedCategory.toLowerCase();
			var currCourses = this.props.curriculum[cat].map(c => c.code);

			list = list.filter(v => {
				return currCourses.includes(v.code);
			});
		}

		completed = list.filter(v => this.props.completedCourses[v.code]);
		normal = list.filter(v => !this.props.completedCourses[v.code]);

		list = [...normal, ...completed];

		return list.map(value => {
			return this.renderNormalCard(value)
		});
	}

	render() {
		return (
			<Container className="courseSelectContainer">
				<Card className="cardOne">
					<Card.Header className="cardOneHeader">
						{this.renderSearchBar()}
					</Card.Header>
				</Card>
				<div className="courseTable">
					{this.renderCourses()}
				</div>
			</Container>
		);
	}
}




export default CourseSelectTable;
