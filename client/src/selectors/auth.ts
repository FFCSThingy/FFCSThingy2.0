import { RootState } from '../app/rootReducer';

export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
