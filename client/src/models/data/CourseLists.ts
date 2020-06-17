export interface CourseList {
	[key: string]: {
		credits: number;
		title: string;
		types: string[];
		simpleCourseTypes: string[];
		shortCourseTypes: string[];
	};
};

export interface CourseSlotList {
	[key: string]: string[];
};

export interface CourseFacultyList {
	[key: string]: string[];
};

export interface CourseTypeList {
	[key: string]: string[];
};