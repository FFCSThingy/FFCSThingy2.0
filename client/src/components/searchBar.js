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
		return <div></div>

	}
}

export default Search;
