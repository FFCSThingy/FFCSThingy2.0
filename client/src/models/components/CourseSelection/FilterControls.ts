export default interface FilterControlsProps {
	typeFilters: string[];
	tabsDisabled: boolean;
	setSelectedCategory: Function;
	setSearchString: Function;
	setTypeFilters: Function;
	setCreditFilter: Function;
	showPlaceholder: boolean;
};