import React from 'react';

class CourseTable extends React.Component{
    render() {

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
                                    <th>Popularity</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr class="active" id="totalCreditsTr">
                                    <td colSpan="8">
                                        <strong>Total Credits:
                                        <span id="totalCredits" class="total-credits">0</span>
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