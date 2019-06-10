import React from 'react';

class CourseTable extends React.Component {
	
	render() {
		var { timetable } = this.props;
		var appendList = timetable.map(value => {
			return (
				<tr className="bottom-table-data" key={value._id}>
					<td className="slot">{value.slot}</td>
					<td className="code">{value.code}</td>
					<td className="title">{value.title}</td>
					<td className="faculty">{value.faculty}</td>
					<td className="venue">{value.venue}</td>
					<td className="credits">{value.credits}</td>
				</tr>
			)
		});
		
		return (
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
								<strong>Total Credits: { this.props.creditCount }</strong>
							</td>
						</tr>
					</tbody>
				</table>
			</div>

		)
	}
}

export default CourseTable;