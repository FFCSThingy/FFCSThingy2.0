import React from 'react';
import '../css/course-select-table.css';

const Course = ({array})=>{

    var tableHeaders= array.slice(0,1).map(value=>{
        return(
            <tr>
                <th className="code-head">{value.code}</th>
                <th  className="title-head">{value.code2}</th>
            </tr>
        )
    })
    
    var courselist =  array.slice(1).map(value=>{
             return(
                    <tr className="courses" key={value.key}>
                        <td className="course-code">{value.code}</td>
                        <td className="course-title">{value.code2}</td>
                    </tr>
               
                 )
    })

    return(
            <div className="courselist">
                <table className="courseTable" >
                    {tableHeaders}
                    {courselist}
                </table>
            </div>
    );
}



export default Course;




