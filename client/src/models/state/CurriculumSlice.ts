import Curriculum from '../data/Curriculum';

export default interface CurriculumSlice {
	selectedPrefix: string,
	list: string[],
	currentData: Curriculum,
}
