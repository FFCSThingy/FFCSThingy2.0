import React, { Component } from "react";

import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';

import { Container, Row, Col, Navbar, Nav, NavDropdown, Form, FormControl, Button, Dropdown } from 'react-bootstrap';

class Generator extends Component{

    render(){
        return(
            <div class="timetableGenerator">
                <div className="container">
                    
                <button type="button" class="btn btn-primary active">Magic Fill</button>
                    <div className="sashajs">
                        <h5>How many Credits do you want</h5>
                        <input type="number"/>
                        <h5>What is your top priority?</h5>
                        <button type="button" class="btn btn-primary active">Morning Slots</button>
                        <button type="button" class="btn btn-primary active">Evening Slots</button>
                        <button type="button" class="btn btn-primary active">Less Classes on Friday</button>
                        <button type="button" class="btn btn-primary active">Less Classes on Friday</button>
                        <button type="button" class="btn btn-primary active">Less Lab Courses</button>
                        <button type="button" class="btn btn-primary active">Less Project Courses</button>
                        <button type="button" class="btn btn-primary active">Prefer Gaps in Timetable</button>
                        <button type="button" class="btn btn-primary active">Less Gaps</button> 
                        
                        <button type="button" class="btn btn-primary active">Find your Timetable</button> 
                    </div>
                </div>

            </div>
        )
    }
}

export default Generator;