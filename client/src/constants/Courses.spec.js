import {
	isLabType,
	isProjectType,
	isTheoryType,
	labTypes,
	projectTypes,
	theoryTypes,
} from './Courses';

describe('constants: Courses', () => {
	it('isLabType', () => {
		expect.hasAssertions();
		labTypes.forEach((l) => {
			expect(isLabType(l)).toBeTruthy();
		});

		projectTypes.forEach((p) => {
			expect(isLabType(p)).toBeFalsy();
		});
		theoryTypes.forEach((t) => {
			expect(isLabType(t)).toBeFalsy();
		});
	});

	it('isProjectType', () => {
		expect.hasAssertions();
		projectTypes.forEach((p) => {
			expect(isProjectType(p)).toBeTruthy();
		});

		labTypes.forEach((l) => {
			expect(isProjectType(l)).toBeFalsy();
		});
		theoryTypes.forEach((t) => {
			expect(isProjectType(t)).toBeFalsy();
		});
	});

	it('isTheoryType', () => {
		expect.hasAssertions();
		theoryTypes.forEach((t) => {
			expect(isTheoryType(t)).toBeTruthy();
		});

		labTypes.forEach((l) => {
			expect(isTheoryType(l)).toBeFalsy();
		});
		projectTypes.forEach((p) => {
			expect(isTheoryType(p)).toBeFalsy();
		});
	});
});
