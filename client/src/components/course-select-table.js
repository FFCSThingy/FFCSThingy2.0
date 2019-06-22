import React from 'react';
import { Card, CardColumns, Col, Container, Form, Row, Nav } from 'react-bootstrap';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../css/course-select-table.css';
import {FaSearch} from 'react-icons/fa';

class CourseSelect extends React.Component {
	state = {
		selectedCategory: 'ALL',
		searchString: '',
		filteredCourses: [],
		error: null,
	}

	componentWillMount() {

	}

	handleChange = (event) => {
		let fieldName = event.target.name;
		let fleldVal = event.target.value;
		this.setState({ [fieldName]: fleldVal })

		if (event.target.name === 'searchString') this.doSearch();
	}

	doSearch() {
		var searchString = this.state.searchString.toUpperCase();

		if (searchString === '') return this.props.courseList;
		if (searchString.endsWith('+')) searchString = searchString.substring(0, searchString.length - 1)

		var searchBySlots = true;
		var slots_title = new Set(["A1", "A2", "B1", "B2", "C1", "C2", "D1", "D2", "E1", "E2", "F1", "F2", "G1", "G2", "L1", "L10", "L11", "L12", "L13", "L14", "L15", "L16", "L19", "L2", "L20", "L21", "L22", "L23", "L24", "L25", "L26", "L27", "L28", "L29", "L3", "L30", "L31", "L32", "L33", "L34", "L35", "L36", "L37", "L38", "L39", "L4", "L40", "L41", "L42", "L43", "L44", "L45", "L46", "L47", "L48", "L49", "L5", "L50", "L51", "L52", "L53", "L54", "L55", "L56", "L57", "L58", "L59", "L6", "L60", "L7", "L71", "L72", "L73", "L74", "L75", "L76", "L77", "L78", "L79", "L8", "L80", "L81", "L82", "L83", "L84", "L85", "L86", "L87", "L88", "L89", "L9", "L90", "L91", "L92", "L93", "L94", "TA1", "TA2", "TAA1", "TAA2", "TB1", "TB2", "TBB2", "TC1", "TC2", "TCC1", "TCC2", "TD1", "TD2", "TDD2", "TE1", "TE2", "TF1", "TF2", "TG1", "TG2", "V1", "V10", "V11", "V2", "V3", "V4", "V5", "V6", "V7", "V8", "V9", "W2", "X1", "X2", "Y1", "Y2", "Z", ""]);

		if (searchString === "")
			searchBySlots = false;
		else
			searchBySlots = true;

		var searchStringSlots = searchString.toUpperCase().split("+");
		var search_val_type = new Set(searchString.toUpperCase().split("*"));

		searchBySlots = searchStringSlots.reduce((a, v) => (a && slots_title.has(v)), searchBySlots);

		var filteredCodes = [];
		if (searchBySlots) {
			filteredCodes = this.props.heatmap.filter(v => {
				return searchStringSlots.every(c => v.slot.split('+').includes(c));
			}).map(v => v.code);
		} else {
			filteredCodes = this.props.heatmap.filter(v => (v.title.toUpperCase().search(searchString) !== -1 || v.code.toUpperCase().search(searchString) !== -1)).map(v => v.code)
		}

		var filteredCourses = this.props.courseList.filter(v => {
			return filteredCodes.includes(v.code);
		});

		filteredCourses.sort();
		filteredCourses.sort(function (a, b) {
			return b.title.indexOf(searchString) - a.title.indexOf(searchString) + b.code.indexOf(searchString) - a.code.indexOf(searchString);
		});

		return filteredCourses;
	}

	renderSearchBar() {
		var tabsDisabled = true;
		
		if (!this.props.curriculum || this.props.selectedCurriculum === 'Curriculum' 
			|| Object.keys(this.props.curriculum).length === 0) {
				tabsDisabled = true;
		}
		else tabsDisabled = false;
		
		return (
			<Container className="searchBarContainer" fluid={true}>
				<Row>
					<Col className="searchColumn" xs={12} md={12}>
						<FaSearch className="searchIcon"></FaSearch>
						<Form.Control
							className="searchBar"
							name='searchString'
							type='text'
							placeholder='Search here'
							spellCheck='false'
							autoComplete='off'
							defaultValue={this.state.searchString}
							onChange={this.handleChange.bind(this)}
						/>
					</Col>
				</Row>

				<Row style={{'padding': '2vh 2vh 0.95px 2vh'}}>
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
		if(value.code === this.props.selectedCourse) className = "courseCard active"
		return (
			<div className="courses" key={value.code} onClick={() => this.props.selectCourse(value.code)}>
				<CardColumns className="courseList">
					<Card className={className}>
						<Card.Body>
							<Card.Title>{value.title}</Card.Title>
							<Card.Text>{value.code} 
								<div className="courseCredits">{value.credits} Credits</div>
							</Card.Text>
						</Card.Body>
					</Card>
				</CardColumns>
			</div>
		)
	}

	renderCourses() {
		var list = this.doSearch();

		if (this.state.selectedCategory !== 'ALL' && Object.keys(this.props.curriculum).length) {
			var cat = this.state.selectedCategory.toLowerCase();
			var currCourses = this.props.curriculum[cat].map(c => c.code);

			list = list.filter(v => {
				return currCourses.includes(v.code);
			});
		}

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




export default CourseSelect;




