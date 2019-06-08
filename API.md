# Route: /

## GET /auth/google
Redirects to the Google login page and associates the user in DB.

## GET /account
Responds with User data
### Response:
```
{
	"timestamp": Last Modified Timestamp,
  	"_id": User MongoID,
  	"google_id": User Google ID,
  	"__v": 0,
  	"display_name": Google Display Name,
  	"email": Google email,
  	"picture": Google picture URL,
  	"selected_courses": [],
  	"previous_timetables": []
}
```

# Route: /course

## GET /getFullHeatmap/:timestamp?
Responds with full course DB

Timestamp is optional
### Response:
```
{
	success: <Boolean>,
	data: [{
		count: <Number>
		percent: <Number>
		timestamp: <Date>
		_id: <String>
		code: <String>
		course_type: <String>
		credits: <Number>
		faculty: <String>
		slot: <String>
		venue: <String>
		title: <String>
	}],
	message: <Error message if !success>
}
```

## GET /getCourseList
Responds with list of course codes, titles, credits, types included in course
### Response:
```
{
	success: <Boolean>,
	data: [{
		code: <String>,
		title: <String>
	}],
	message: <Error message if !success>
}
```

## GET /getCourseByDetails/:code/:type/:faculty/:venue
Responds with course based on these 4 params


## GET /getCourseByID/:id
Responds with course based on mongoID


# Route: /curriculum

## GET /getPrefixes
Gets list of available sample curriculums

### Response:
```
{
	success: <Boolean>,
	data: [ <String> ],
	message: <Error message if !success>
}
```

## GET /getCurriculumFromPrefix/:prefix
Gets curriculum for the corresponding prefix
### Response:
```
{
	success: <Boolean>,
	data: {
		_id: <String>,
		reg_prefix: <String>,
		todo_creds: {
			pc: <Number>,
			pe: <Number>,
			uc: <Number>,
			ue: <Number>
		}, 
		bridge: [{
			code: <String>,
			title: <String>,
			course_type: <String>,
			l: <Number>,
			t: <Number>,
			p: <Number>,
			j: <Number>,
			c: <Number>
		}],
		pc: [{}],
		pe: [{}],
		uc: [{}],
		ue: [{}]
	},
	message: <Error message if !success>
}
```