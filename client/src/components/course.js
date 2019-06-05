import React from 'react';

const Course = ({array})=>{

    var tableHeaders= array.slice(0,1).map(value=>{
        return(
            <tr>
                <th className="lefthead">{value.code}</th>
                <th  className="lefthead">{value.code2}</th>
            </tr>
        )
    })
    
    var courselist =  array.slice(1).map(value=>{
             return(
                        <tr className="courses" key={value.key}>
                    <td className="leftdata">{value.code}</td>
                    <td className="leftdata">{value.code2}</td>
                        </tr>
               
                 )
    })

    return(

        
        <div className="Complete">

          <div className="courselist">
              <table className="courseTable" >
                    
            {tableHeaders}
              {courselist}
                   
            
              </table>

              </div>
              </div>
    );
}



export default Course;




