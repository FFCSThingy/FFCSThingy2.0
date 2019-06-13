import React, { Component } from "react";
import "../css/magicFill.css";
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';

import { Container, Row, Col, Navbar, Nav, NavDropdown, Form, FormControl, Button, Dropdown } from 'react-bootstrap';

class Generator extends Component{
    handleClick=(e)=>{
            var filter = document.getElementById("magicData");
            if(filter.className==="hide"){
                filter.className="show";
            }
            else{
                filter.className="hide";
            }
    }

    handleTime=(e)=>{
        if(e.target.id==="filterButton-1"){
            e.target.id="filterButton-2";
            var x=document.getElementsByClassName("btn btn-primary active slots");
            if(x.length!=0){
                x[0].id="filterButton-1";
                x[0].className="btn btn-primary active";
            }
            e.target.className="btn btn-primary active slots"
        }
        else{
            e.target.id="filterButton-1";
            e.target.className="btn btn-primary active"
        }
    }
    handleDay=(e)=>{
        if(e.target.id==="filterButton-1"){
            e.target.id="filterButton-2";
            var x=document.getElementsByClassName("btn btn-primary active day");
            if(x.length!=0){
                x[0].id="filterButton-1";
                x[0].className="btn btn-primary active";
            }
            e.target.className="btn btn-primary active day"
        }
        else{
            e.target.id="filterButton-1";
            e.target.className="btn btn-primary active";
        }
    }
    handleCourseType=(e)=>{
        if(e.target.id==="filterButton-1"){
            e.target.id="filterButton-2";
            var x=document.getElementsByClassName("btn btn-primary active course");
            if(x.length!=0){
                x[0].id="filterButton-1";
                x[0].className="btn btn-primary active";
            }
            e.target.className="btn btn-primary active course"
        }
        else{
            e.target.id="filterButton-1";
            e.target.className="btn btn-primary active"
        }
    }
    handleGaps=(e)=>{
        if(e.target.id==="filterButton-1"){
            e.target.id="filterButton-2";
            var x=document.getElementsByClassName("btn btn-primary active gaps");
            if(x.length!=0){
                x[0].id="filterButton-1";
                x[0].className="btn btn-primary active";
            }
            e.target.className="btn btn-primary active gaps"
        }
        else{
            e.target.id="filterButton-1";
            e.target.className="btn btn-primary active"
        }
    }

    render(){
        return(
            <div class="timetableGenerator">
                <div className="container">
                    
                <button type="button" class="btn btn-primary active" id="magic" onClick={this.handleClick}>Magic Fill</button>
                    <div className="hide" id="magicData">
                    <div class="form-group">
                    <label for="creditsEnterlabel" id="creditLabel">How many Credits do you want?</label><hr className="hrz"></hr>
                    <input class="form-control" id="creditsEnter" type="number"/>
                    </div>
                        <h5>What are your top priorities?</h5><hr></hr>
                        <button type="button" class="btn btn-primary active" id="filterButton-1" onClick={this.handleTime}>Morning Slots</button>
                        <button type="button" class="btn btn-primary active" id="filterButton-1" onClick={this.handleTime}>Evening Slots</button>
                        <button type="button" class="btn btn-primary active" id="filterButton-1" onClick={this.handleDay}>Less Classes on Friday</button>
                        <button type="button" class="btn btn-primary active" id="filterButton-1" onClick={this.handleDay}>Less Classes on Monday</button>
                        <button type="button" class="btn btn-primary active" id="filterButton-1" onClick={this.handleCourseType}>Less Lab Courses</button>
                        <button type="button" class="btn btn-primary active" id="filterButton-1" onClick={this.handleCourseType}>Less Project Courses</button>
                        <button type="button" class="btn btn-primary active" id="filterButton-1" onClick={this.handleGaps}>Prefer Gaps in Timetable</button>
                        <button type="button" class="btn btn-primary active" id="filterButton-1" onClick={this.handleGaps}>Less Gaps</button> 
                        <br></br>
                        <button type="button" class="btn btn-primary active" id="submitButton">Find your Timetable</button> 
                    </div>
                </div>

            </div>
        )
    }
}

export default Generator;