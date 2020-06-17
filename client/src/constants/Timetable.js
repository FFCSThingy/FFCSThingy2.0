const HEADERS = [
	[
		'THEORY HOURS', 
		'08:00 08:50', '09:00 09:50', '10:00 10:50', '11:00 11:50', '12:00 12:50', '01:00 01:50', 
		'', // Break Slot
		'03:00 03:50', '04:00 04:50', '05:00 05:50', '06:00 06:50', '07:00 07:50', '08:00 08:50',
	],
	[
		'LAB HOURS', 
		'08:00 08:50', '09:00 09:50', '10:00 10:50', '11:00 11:50', '12:00 12:50', '01:00 01:50', 
		'03:00 03:50', '04:00 04:50', '05:00 05:50', '06:00 06:50', '07:00 07:50', '08:00 08:50',
	],
];

const breakString = 'B R E A K';

const SLOTS = [
	['MON', 'A1/L1', 	'B1/L2', 	'C1/L3', 	'A2/L4', 	'B2/L5', 	'C2/L6', 	breakString, 	'A3/L37', 	'B3/L38', 	'C3/L39', 	'A4/L40', 	'B4/L41', 	'C4/L42'],
	['TUE', 'D1/L7', 	'E1/L8', 	'A1/L9', 	'D2/L10', 	'E2/L11', 	'A2/L12', 					'D3/L43', 	'E3/L44', 	'A3/L45', 	'D4/L46', 	'E4/L47', 	'A4/L48'],
	['WED', 'B1/L13', 	'C1/L14', 	'D1/L15', 	'B2/L16', 	'C2/L17', 	'D2/L18', 					'B3/L49', 	'C3/L50', 	'D3/L51', 	'B4/L52', 	'C4/L53', 	'D4/L54'],
	['THU', 'E1/L19', 	'TA1/L20', 	'TB1/L21', 	'E2/L22', 	'TA2/L23', 	'TB2/L24', 					'E3/L55', 	'TA3/L56', 	'TB3/L57', 	'E4/L58', 	'TA4/L59', 	'TB4/L60'],
	['FRI', 'TC1/L25', 	'TD1/L26', 	'TE1/L27', 	'TC2/L28', 	'TD2/L29', 	'TE2/L30', 					'TC3/L61', 	'TD3/L62', 	'TE3/L63', 	'TC4/L64', 	'TD4/L65', 	'TE4/L66'],
	['SAT', 'TAA1/L31', 'TBB1/L32', 'TCC1/L33', 'TAA2/L34', 'TBB2/L35', 'TCC2/L36', 				'TAA3/L67', 'TBB3/L68', 'TCC3/L69', 'TAA4/L70', 'TBB4/L71', 'TCC4/L72'],
];

const breakPosition = SLOTS[0].indexOf(breakString);
const breakRowSpan = SLOTS.length + 2;

export {
	SLOTS,
	HEADERS,
	breakPosition,
	breakRowSpan,
};
