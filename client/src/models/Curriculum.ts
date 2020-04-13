export interface CurriculumCourse {
	_id: string;
	code: string;
	title: string;
	course_type: string;
	l: number;
	t: number;
	p: number;
	j: number;
	c: number;
}

export interface Curriculum {
	[key: string]: any;
	_id: string;
	reg_prefix: string;
	__v ?: number;
	todo_creds: {
		pc: number;
		uc: number;
		pe: number;
		ue: number;
	}
	bridge: CurriculumCourse[];
	pc: CurriculumCourse[];
	uc: CurriculumCourse[];
	pe: CurriculumCourse[];
	ue: CurriculumCourse[];
};