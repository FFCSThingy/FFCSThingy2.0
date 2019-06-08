import React from 'react';

class CourseTable extends React.Component{
    render() {
       
        var {list}=this.props;
        var appendList=list.map(value=>{
          var creditCount=document.getElementById("total");
            creditCount.innerHTML=creditCount.innerHTML+value[5];
                return(
                    <tr className="bottom-table-data" key={value[6]}>
                        <td className="slot">{value[0]}</td>
                        <td className="code">{value[1]}</td>
                        <td className="title">{value[2]}</td>
                        <td className="faculty">{value[3]}</td>
                        <td className="venue">{value[4]}</td>
                        <td className="credits">{value[5]}</td>
                    </tr>
                )
        });
        return(

            <div className="FinalCT">
                  <table id="courseListTbl" class="table">
                            <thead class="tabletop">
                                <tr class="fiercy-red">
                                    <th>Slot</th>
                                    <th>Code</th>
                                    <th>Title</th>
                                    <th>Faculty</th>
                                    <th>Venue</th>
                                    <th>Credits</th>
                                </tr>
                            </thead>
                            <tbody>

                                    {appendList}
                                <tr class="active" id="totalCreditsTr">
                                    <td colSpan="8">
                                        <strong>Total Credits:
                                        <span id="total" class="total-credits">0</span>
                                        </strong>
                                    </td>   
                                </tr>
                            </tbody>
                        </table>
            </div>

        )
    }
}

export default CourseTable;