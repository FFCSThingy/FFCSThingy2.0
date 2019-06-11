import React from 'react';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Card, CardColumns, Form } from 'react-bootstrap';
import '../css/course-select-table.css';
import axios from 'axios';
// import Search from './searchBar';

class CourseSelect extends React.Component {
	state = {
		courseList: JSON.parse(localStorage.getItem('courseList')) || [],
		timestamp: localStorage.getItem('courseListTimestamp') || null,
		curriculumList: [],
		searchString: '',
		filteredCourses: [],
		selectedCurriculum: '',
		error: null,
		courseSlots: this.getCourseSlotsList(),
	}

	componentWillMount() {
		axios.get("/course/getCourseList")
			.then(res => {
				if (res.data.success) {
					if (res.status == 304) {
						var courses = JSON.parse(localStorage.getItem('courseList'));
						this.setState({ courseList: courses });
					} else {
						this.setState({ courseList: res.data.data.courseList });
						localStorage.setItem('courseListTimestamp', res.data.data.timestamp);
						localStorage.setItem('courseList', JSON.stringify(res.data.data.courseList));
					}

				} else
					this.setState({ error: res.data.message })
			});

		axios.get("/curriculum/getPrefixes")
			.then(res => {
				if (res.data.success) {
					this.setState({ curriculumList: res.data.data, selectedCurriculum: res.data.data[0] });
				} else
					this.setState({ error: res.data.message })
			});
	}

	handleChange(event) {
		let fieldName = event.target.name;
		let fleldVal = event.target.value;
		this.setState({ [fieldName]: fleldVal })

		if (event.target.name === 'searchString') this.doSearch();
	}

	getCourseSlotsList() {
		var courseList = JSON.parse(localStorage.getItem('courseList'));
		var courseSlots = this.props.heatmap.reduce((a, v) => {
			var slots = v.slot.split('+');
			
			if (v.slot === 'NIL') ;
			else if (a[v.code]) 
				a[v.code].slots = a[v.code].slots.concat(slots);
			else a[v.code] = { slots: slots, title: courseList.filter(c => c.code === v.code)[0].title };

			return a;
		}, {});
		courseSlots = Object.keys(courseSlots)
			.reduce((a, v) => [...a, {code: v, slots: Array.from(new Set(courseSlots[v].slots)), title: courseSlots[v].title }], []);
		return courseSlots;
		// this.setState({ courseSlotList: courseSlots });
	}

	doSearch() {
		var searchString = this.state.searchString.toUpperCase();
		var searchBySlots = true;
		var slots_title = new Set(["A1", "A2", "B1", "B2", "C1", "C2", "D1", "D2", "E1", "E2", "F1", "F2", "G1", "G2", "L1", "L10", "L11", "L12", "L13", "L14", "L15", "L16", "L19", "L2", "L20", "L21", "L22", "L23", "L24", "L25", "L26", "L27", "L28", "L29", "L3", "L30", "L31", "L32", "L33", "L34", "L35", "L36", "L37", "L38", "L39", "L4", "L40", "L41", "L42", "L43", "L44", "L45", "L46", "L47", "L48", "L49", "L5", "L50", "L51", "L52", "L53", "L54", "L55", "L56", "L57", "L58", "L59", "L6", "L60", "L7", "L71", "L72", "L73", "L74", "L75", "L76", "L77", "L78", "L79", "L8", "L80", "L81", "L82", "L83", "L84", "L85", "L86", "L87", "L88", "L89", "L9", "L90", "L91", "L92", "L93", "L94", "TA1", "TA2", "TAA1", "TAA2", "TB1", "TB2", "TBB2", "TC1", "TC2", "TCC1", "TCC2", "TD1", "TD2", "TDD2", "TE1", "TE2", "TF1", "TF2", "TG1", "TG2", "V1", "V10", "V11", "V2", "V3", "V4", "V5", "V6", "V7", "V8", "V9", "W2", "X1", "X2", "Y1", "Y2", "Z", ""]);

		if (searchString === "")
			searchBySlots = false;
		else
			searchBySlots = true;

		var searchStringSlots = searchString.toUpperCase().split("+");
		var search_val_type = new Set(searchString.toUpperCase().split("*"));
		for (var i in searchStringSlots) {
			if (!(slots_title.has(searchStringSlots[i]))) {
				searchBySlots = false;
			}
		}

		var filteredCodes = [];
		if(searchBySlots) {
			filteredCodes = this.props.heatmap.filter(v => {
				return searchStringSlots.every(c => v.slot.split('+').includes(c));
			}).map(v => v.code);
		} else {
			filteredCodes = this.props.heatmap.filter(v => (v.title.toUpperCase().search(searchString) !== -1 || v.code.toUpperCase().search(searchString) !== -1)).map(v => v.code)
		}

		// return filteredCodes;
		var filteredCourses = this.state.courseList.filter(v => {
			return filteredCodes.includes(v.code);
		});

		filteredCourses.sort();
		filteredCourses.sort(function (a, b) {
			return b.title.indexOf(searchString) - a.title.indexOf(searchString) + b.code.indexOf(searchString) - a.code.indexOf(searchString);
		});

		this.setState({filteredCourses: filteredCourses });
		
		return filteredCourses;
	}

	renderSearchBar() {
		var curriculumChoices = this.state.curriculumList.map(v => <option value={v}>{v}</option>);
		return (
			<Container fluid={true}>
				<Row>
					<Col xs={5} md={5}>
						<Form.Control
							as='select'
							name='selectedCurriculum'
							defaultValue={this.state.selectedCurriculum}
							onChange={this.handleChange.bind(this)}
						>
							{curriculumChoices}
						</Form.Control>
					</Col>
					<Col xs={7} md={7}>
						<Form.Control
							name='searchString'
							type='text'
							placeholder='Search'
							defaultValue={this.state.searchString}
							onChange={this.handleChange.bind(this)}
						/>
					</Col>
				</Row>
			</Container>
		)
	}

	renderCourses() {
		var list = this.state.courseList;
		if(this.state.searchString !== '') list = this.state.filteredCourses;
		
		return list.filter(v => {
			return true;
			})
			.map(value => {
				return (
					<div className="courses" key={value.code} onClick={() => this.props.selectCourse(value.code)}>
						<CardColumns className="courseList">
							<Card className="courseCard">
								<Card.Body>
									<Card.Title>{value.title}</Card.Title>
									<Card.Text>{value.code} <div className="courseCredits">{value.credits} Credits</div>
									</Card.Text>
								</Card.Body>
							</Card>
						</CardColumns>
					</div>
				)
			});
	}

	render() {


		return (
			<Container>
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




