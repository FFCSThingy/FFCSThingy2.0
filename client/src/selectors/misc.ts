import { RootState } from '../app/rootReducer';

export const selectTheme = (state: RootState) => state.misc.theme;
