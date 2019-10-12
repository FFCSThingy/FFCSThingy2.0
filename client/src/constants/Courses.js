const labTypes = ['LO', 'ELA'];
const projectTypes = ['PJT', 'EPJ'];
const theoryTypes = ['TH', 'ETH', 'SS'];
const simpleTypes = ['Lab', 'Project', 'Theory'];

const isLabType = (type) => labTypes.includes(type); 
const isProjectType = (type) => projectTypes.includes(type); 
const isTheoryType = (type) => theoryTypes.includes(type); 

export {
	labTypes,
	projectTypes,
	theoryTypes,
	simpleTypes,
	isLabType,
	isProjectType,
	isTheoryType,
}