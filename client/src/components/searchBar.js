import React from 'react';
import '../css/search-bar.css';


class Search extends React.Component{

state={
     code:null,
     key:null
    }

handleChange=(e)=>{
       this.setState({
           code:e.target.value,
           key:Math.random()
       })
}

handleSubmit=(e)=>{
    e.preventDefault();
    this.props.addCourse(this.state);
}

handleclickevent=(e)=>{
    var y=document.getElementById("LTJPC");
   if( y.className="after"){
        y.className="before";
    }
}

handleClick=(e)=>{
    var y=document.getElementById("LTJPC");
    if (y.className="before"){
        y.className="after";
    }
}



render() {

  return (
  
   <div id ="search-bar">
        <form onSubmit={this.handleSubmit}>
        <input onChange={this.handleChange} placeholder="Search By Course Code / Title / Slot" 
            type="text" spellcheck="false" autocomplete="off"
            id="search-bar-placeholder" />
        </form>
        <a  href="#"><i class="material-icons" onClick={this.handleSubmit}>search</i></a>
   </div>

        )

        }
}

export default Search;
