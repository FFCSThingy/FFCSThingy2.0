import React from 'react';

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
        <input onChange={this.handleChange} placeholder="Search By Course Code/ Title / Slot" type="text" id="courseselection" />
        </form>
        <a href="#"><i class="fas fa-filter" id="filter" onClick={this.handleClick}></i></a>

        <div className="before" id="LTJPC" >
            
           <a onClick={this.handleclickevent} href="#"><span>Theory Only</span></a>
            <a onClick={this.handleclickevent} href="#"><span>Lab Only</span></a>
            <a onClick={this.handleclickevent} href="#"><span>Theory+Lab</span></a>
            <a onClick={this.handleclickevent} href="#"><span>Theory+Project</span></a>
            <a onClick={this.handleclickevent} href="#"><span>Theory+Lab+Project</span></a>

        </div>

   </div>

  )

}
}
export default Search;
