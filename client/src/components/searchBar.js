import React from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
// import Form from 'react-bootstrap/FormControl';
import '../css/search-bar.css';
import axios from 'axios';


class Search extends React.Component {

	state = {
		curriculumList: [],
		code: null,
		key: null
	}

	componentWillMount() {
		axios.get("/curriculum/getPrefixes")
			.then(res => {
				if (res.data.success) {
						this.setState({ curriculumList: res.data.data });
				} else
					this.setState({ error: res.data.message })
			});
	}

	handleChange = (e) => {
		this.setState({
			code: e.target.value,
			key: Math.random()
		})
	}

	handleSubmit = (e) => {
		e.preventDefault();
		this.props.addCourse(this.state);
	}

	handleclickevent = (e) => {
		var y = document.getElementById("LTJPC");
		if (y.className = "after") {
			y.className = "before";
		}
	}

	handleClick = (e) => {
		var y = document.getElementById("LTJPC");
		if (y.className = "before") {
			y.className = "after";
		}
	}



	render() {
		var curriculumChoices = this.state.curriculumList.map(v => <option value={v}>{v}</option>);

		return (
			<Container fluid={true}>
				<Row>
					<Col xs={5} md={5}>
						<Form.Control as='select'>
							{ curriculumChoices }
						</Form.Control>
					</Col>
					<Col xs={7} md={7}>
						<Form.Control type='text' placeholder='Search'/>
					</Col>
				</Row>
			</Container>

			// <div id="search-bar">
			// 	<form onSubmit={this.handleSubmit}>
			// 		<input onChange={this.handleChange} placeholder="Search By Course Code / Title / Slot"
			// 			type="text" spellcheck="false" autocomplete="off"
			// 			id="search-bar-placeholder" />
			// 	</form>
			// 	<a href="#"><i class="material-icons" onClick={this.handleSubmit}>search</i></a>
			// </div>

		)

	}
}

export default Search;
