export const labTypes = ['LO', 'ELA'];
export const projectTypes = ['PJT', 'EPJ'];
export const theoryTypes = ['TH', 'ETH', 'SS'];
export const simpleTypes = ['Lab', 'Project', 'Theory'];
export const validSlots = [
	'A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'D1', 'D2',
	'E1', 'E2', 'F1', 'F2', 'G1', 'G2',
	'L1', 'L10', 'L11', 'L12', 'L13', 'L14', 'L15', 'L16', 'L19',
	'L2', 'L20', 'L21', 'L22', 'L23', 'L24', 'L25', 'L26', 'L27', 'L28', 'L29',
	'L3', 'L30', 'L31', 'L32', 'L33', 'L34', 'L35', 'L36', 'L37', 'L38', 'L39',
	'L4', 'L40', 'L41', 'L42', 'L43', 'L44', 'L45', 'L46', 'L47', 'L48', 'L49',
	'L5', 'L50', 'L51', 'L52', 'L53', 'L54', 'L55', 'L56', 'L57', 'L58', 'L59',
	'L6', 'L60',
	'L7', 'L71', 'L72', 'L73', 'L74', 'L75', 'L76', 'L77', 'L78', 'L79',
	'L8', 'L80', 'L81', 'L82', 'L83', 'L84', 'L85', 'L86', 'L87', 'L88', 'L89',
	'L9', 'L90', 'L91', 'L92', 'L93', 'L94',
	'TA1', 'TA2', 'TAA1', 'TAA2',
	'TB1', 'TB2', 'TBB2',
	'TC1', 'TC2', 'TCC1', 'TCC2',
	'TD1', 'TD2', 'TDD2',
	'TE1', 'TE2', 'TF1', 'TF2', 'TG1', 'TG2',
	'V1', 'V10', 'V11', 'V2', 'V3', 'V4', 'V5', 'V6',
	'V7', 'V8', 'V9', 'W2', 'X1', 'X2', 'Y1', 'Y2', 'Z', ''];

export const isLabType = (type) => labTypes.includes(type);
export const isProjectType = (type) => projectTypes.includes(type);
export const isTheoryType = (type) => theoryTypes.includes(type);
