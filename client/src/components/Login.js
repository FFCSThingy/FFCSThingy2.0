import React from 'react';

import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Button } from 'react-bootstrap';

import axios from 'axios';

class Login extends React.Component {

	render() {
		return (
			<Container>
				<Button href='http://localhost:3001/auth/google'>Login With Google</Button>
			</Container>	
		)
	}
}

export default Login;