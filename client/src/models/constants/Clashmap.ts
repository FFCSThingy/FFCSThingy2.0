export default interface Clashmap {
	[key: string]: {
		clashesWith: string[];
		isFilled: boolean;
		currentlyClashesWith: string[];
	};
}
