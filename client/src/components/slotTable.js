import React, { Component } from "react";
import axios from 'axios';
import './slotTable.css';
// import Icon from 'react-native-vector-icons/FontAwesome';
class SlotTable extends Component {
    state={
        posts:[]
        }
componentDidMount(){
        axios.get('https://jsonplaceholder.typicode.com/users')
       .then(res=>{
            this.setState({
                posts:res.data  
            })
        })
    }


handleaddedfilters=(e)=>{
    var x=document.getElementById("selectedFilter");
    console.log(x);
    x.removeChild(e.target);
 }
handleclick=(e)=>{
                var x=document.getElementById("selectedFilter");
                var y=document.createElement("a");
                x.appendChild(y);
                y.textContent=e.target.textContent;
                y.href="#";
                y.setAttribute(y,"{this.handleaddedfilters}");
            }


handleClick=(e)=>{
    var data=document.getElementById("data");
    if(data.className==="hide"){
        data.className="show";  
    }
    else{
        data.className="hide";
    }
}

handleCross=(e)=>{
    var data=document.getElementById("data");
    data.className="hide";  
}
handlevenues=(e)=>{
    var x=document.getElementById("selectedFilter");
    var y=document.createElement("a");
    x.appendChild(y);
    y.textContent=e.target.textContent;
    y.href="#";
}
    render(){
        var courses=this.state.posts.map(value=>{
            return(
                <div className="slots" key={value.id}>
                        <h4>Name:{value.name}</h4>
                        <h5>Email:{value.email}</h5>
                        <p>Website:{value.website}</p>
                </div>
            )
        })
        return(
         
            <div className="righttable">
                <div className="tiles">
                <button onClick={this.handleclick} className="notclicked">Lab</button>
                <button onClick={this.handleclick} className="notclicked">Theory </button>
                <button onClick={this.handleclick} className="notclicked">Project</button>
                <a href="#" id="venuefilter" onClick={this.handleClick}><span>Filter by Venue</span><i class="fas fa-filter" id="filter"></i></a>
                <div className="hide" id="data">
                    <div className="venues">Venue Filters</div>
                    <a href="#" onClick={this.handlevenues}><span>SJT</span></a>
                    <a href="#" onClick={this.handlevenues}><span>TT</span></a>
                    <a href="#" onClick={this.handlevenues}><span>GDN</span></a>
                    <a href="#" onClick={this.handlevenues}><span>MB</span></a>
                    <a href="#" onClick={this.handlevenues}><span>SMV</span></a>
                    <a href="#" onClick={this.handleCross}><i class="material-icons" id="cross" >
                            clear
                    </i></a>
                </div>
                <hr></hr>
                <div className="filtersAdded" id="selectedFilter">Filters Added:</div>
                <hr></hr>
                </div>

                {courses}

            </div>
           
        )
    }
}
export default SlotTable;