export default interface TTGenPrefs {
	slot: { 
		evening: number;
		morning: number;
	};
	course: { 
		ELA: number; 
		EPJ: number; 
		ETH: number;
	};
	days: {
		Monday: number;
		Tuesday: number;
		Wednesday: number;
		Thursday: number;
		Friday: number;	
	};
	misc: { 
		checkboard: 1 | 0;

	};
	credits: number;
};