const labTypes = ['LO', 'ELA'];
const projectTypes = ['PJT', 'EPJ'];
const theoryTypes = ['TH', 'ETH', 'SS'];
const simpleTypes = ['Lab', 'Project', 'Theory'];
const validSlots = [
	'A1', 'TA1', 'TAA1', 
	'A2', 'TA2', 'TAA2', 
	'A3', 'TA3', 'TAA3', 
	'A4', 'TA4', 'TAA4',
	
	'B1', 'TB1', 'TBB1', 
	'B2', 'TB2', 'TBB2', 
	'B3', 'TB3', 'TBB3', 
	'B4', 'TB4', 'TBB4',
	
	'C1', 'TC1', 'TCC1', 
	'C2', 'TC2', 'TCC2', 
	'C3', 'TC3', 'TCC3', 
	'C4', 'TC4', 'TCC4',
	
	'D1', 'TD1', 'TDD1', 
	'D2', 'TD2', 'TDD2', 
	'D3', 'TD3', 'TDD3', 
	'D4', 'TD4', 'TDD4',
	
	'E1', 'TE1', 'TEE1', 
	'E2', 'TE2', 'TEE2', 
	'E3', 'TE3', 'TEE3', 
	'E4', 'TE4', 'TEE4',
	
	'F1', 'TF1', 'TFF1', 
	'F2', 'TF2', 'TFF2', 
	'F3', 'TF3', 'TFF3', 
	'F4', 'TF4', 'TFF4',
	
	'G1', 'TG1', 'TGG1', 
	'G2', 'TG2', 'TGG2', 
	'G3', 'TG3', 'TGG3', 
	'G4', 'TG4', 'TGG4',
	
	'L1', 'L10', 'L11', 'L12', 'L13', 'L14', 'L15', 'L16', 'L17', 'L18', 'L19',
	'L2', 'L20', 'L21', 'L22', 'L23', 'L24', 'L25', 'L26', 'L27', 'L28', 'L29',
	'L3', 'L30', 'L31', 'L32', 'L33', 'L34', 'L35', 'L36', 'L37', 'L38', 'L39',
	'L4', 'L40', 'L41', 'L42', 'L43', 'L44', 'L45', 'L46', 'L47', 'L48', 'L49',
	'L5', 'L50', 'L51', 'L52', 'L53', 'L54', 'L55', 'L56', 'L57', 'L58', 'L59',
	'L6', 'L60', 'L61', 'L62', 'L63', 'L64', 'L65', 'L66', 'L67', 'L68', 'L69',
	'L7', 'L70', 'L71', 
	
	'L72', 'L73', 'L74', 'L75', 'L76', 'L77', 'L78', 'L79',
	'L8', 'L80', 'L81', 'L82', 'L83', 'L84', 'L85', 'L86', 'L87', 'L88', 'L89',
	'L9', 'L90', 'L91', 'L92', 'L93', 'L94', 'L95', 'L96', 'L97', 'L98', 'L99',
	
	'V1', 'V10', 'V11', 'V2', 'V3', 'V4', 'V5', 'V6', 'V7', 'V8', 'V9', 
	'W2', 'X1', 'X2', 'Y1', 'Y2', 'Z', ''
];

const isLabType = (type) => labTypes.includes(type);
const isProjectType = (type) => projectTypes.includes(type);
const isTheoryType = (type) => theoryTypes.includes(type);

export {
	labTypes,
	projectTypes,
	theoryTypes,
	simpleTypes,
	validSlots,
	isLabType,
	isProjectType,
	isTheoryType,
};
