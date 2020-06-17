const HEADERS = [
	[
		'THEORY HOURS', '08:00 08:50', '09:00 09:50', '10:00 10:50', '11:00 11:50', '12:00 12:50', '', '',
		'02:00 02:50', '03:00 03:50', '04:00 04:50', '05:00 05:50', '06:00 06:50', '07:00 07:50',
	],
	[
		'LAB HOURS', '08:00 08:45', '08:45 09:30', '10:00 10:45', '10:45 11:30', '11:30 12:15', '12:15 01:00',
		'02:00 02:45', '02:45 03:30', '04:00 04:45', '04:45 05:30', '05:30 06:15', '06:15 07:00',
	],
];

const breakString = 'B R E A K';

const SLOTS = [
	['MON', 'A1/L1', 'F1/L2', 'D1/L3', 'TB1/L4', 'TG1/L5', '/L6', breakString, 'A2/L31', 'F2/L32', 'D2/L33', 'TB2/L34', 'TG2/L35', 'V3/L36'],
	['TUE', 'B1/L7', 'G1/L8', 'E1/L9', 'TC1/L10', 'TAA1/L11', '/L12', 'B2/L37', 'G2/L38', 'E2/L39', 'TC2/L40', 'TAA2/L41', 'V4/L42'],
	['WED', 'C1/L13', 'A1/L14', 'F1/L15', 'V1/L16', 'V2/', 'EXTM/', 'C2/L43', 'A2/L44', 'F2/L45', 'TD2/L46', 'TBB2/L47', 'V5/L48'],
	['THU', 'D1/L19', 'B1/L20', 'G1/L21', 'TE1/L22', 'TCC1/L23', '/L24', 'D2/L49', 'B2/L50', 'G2/L51', 'TE2/L52', 'TCC2/L53', 'V6/L54'],
	['FRI', 'E1/L25', 'C1/L26', 'TA1/L27', 'TF1/L28', 'TD1/L29', '/L30', 'E2/L55', 'C2/L56', 'TA2/L57', 'TF2/L58', 'TDD2/L59', 'V7/L60'],
];

const breakPosition = SLOTS[0].indexOf(breakString);
const breakRowSpan = SLOTS.length + 2;

export {
	SLOTS,
	HEADERS,
	breakPosition,
	breakRowSpan,
};
