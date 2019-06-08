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
	"selected_curriculum": Curriculum prefix String  


  	"selected_courses": [{
		"code": <String>,
		"title": <String>,
		"course_type": <String>,
		"credits": <String>,
		"slot": <String>,
		"faculty": <String>,
		"venue": <String>,
		"timetableName": <String>
	  }],


  	"previous_timetables": [{
		"code": <String>,
		"title": <String>,
		"course_type": <String>,
		"credits": <String>,
		"slot": <String>,
		"faculty": <String>,
		"venue": <String>,
		"semester": <String>
	  }],
	
	"name": <String>,
	"reg_no": <String>,
	"gender": <String>,
	"programme": <String>,
	"branch": <String>,
	"school": <String>,
	"campus": <String>,
	"joined_yr": <String>,

	grades: {
		"cgpa": <Number>,
		"creds_reg": <Number>,
		"creds_earned": <Number>,
		"s": <Number>,
		"a": <Number>,
		"b": <Number>,
		"c": <Number>,
		"d": <Number>,
		"e": <Number>,
		"f": <Number>,
		"n": <Number>,
	},

	credit_summary: {
		"pc_reqd": <Number>,
		"pc_earned": <Number>,
		"uc_reqd": <Number>,
		"uc_earned": <Number>,
		"pe_reqd": <Number>,
		"pe_earned": <Number>,
		"ue_reqd": <Number>,
		"ue_earned": <Number>,
		"bridge_reqd": <Number>,
		"bridge_earned": <Number>,
		"total_reqd": <Number>,
		"total_earned": <Number>,
		"sts_distib": <Number>,
		"sts_reqd": <Number>,
		"sts_earned": <Number>,
		"exc_distib": <Number>,
		"exc_reqd": <Number>,
		"exc_earned": <Number>,
		"lang_distib": <Number>,
		"lang_reqd": <Number>,
		"lang_earned": <Number>,
	},
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
		title: <String>,
		credits: <Number>,
		types: [<String>]
	}],
	message: <Error message if !success>
}
```

## GET /getCourseByDetails/:code/:type/:faculty/:venue/:slot
Responds with course based on these 5 params


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

# Route: /user

## GET /getSelectedCourses
Gets selected courses for the user

### Response:
```

```


## POST /updateSelectedCoursesBulk
Sets the passed array as selected_courses array for the user

### Request:
```
selected_courses:	[{
	count: <Number>
	percent: <Number>
	timestamp: <Date>
	_id: <String>	(NECESSARY)
	code: <String>	(NECESSARY)
	course_type: <String>	(NECESSARY)
	credits: <Number>
	faculty: <String>	(NECESSARY)
	slot: <String>	(NECESSARY)
	venue: <String>	(NECESSARY)
	title: <String>
}]
```

### Response:
```
User Doc (Refer /account)
```

## GET /setSelectedCurriculum
Sets curriculum as selected for the user

### Request: 
```
selected_curriculum: <String>
```

### Response:
```
User Doc (Refer /account)
```