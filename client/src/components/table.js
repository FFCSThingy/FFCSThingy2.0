import React from 'react';

class Table extends React.Component{
    state={
        list:[]
            }
    handleclick=(e)=>{
        var x=document.getElementById("venues");
        x.className="show";
    };
    handleclickid=(e)=>{
                var y=document.getElementById("venues");
                y.className="hide";
                var venueselected=document.getElementById("VenueSetup");
                var data1= document.createElement("div");
                var data = document.createElement("div");
                var x = venueselected.appendChild(data1);
                var z=data1.appendChild(data);
                data.textContent=e.target.className;
                data.id="newdiv";
                y.removeChild(e.target);

    };
    render(){
        return(
            <div className="slotTable" id="VenueSetup">
                <button>Lab</button>
                <button>Theory</button> 
                <button>Practicals</button>

                <button className="venue" onClick={this.handleclick}>Venue Filter</button>

                 <div className="hide" id="venues">
                                            <a href="#" id="one" onClick={this.handleclickid} className="SJT">SJT</a>
                                            <a href="#" id="one" className="TT" onClick={this.handleclickid}>TT</a>
                                            <a href="#" id="one" className="MB" onClick={this.handleclickid}>MB</a>
                                            <a href="#" id="one" className="SMV" onClick={this.handleclickid}>SMV</a>
                                            <a href="#" id="one" className="GDN" onClick={this.handleclickid}>GDN</a>    

                </div>

    
            </div>
        )
    }
}

export default Table;