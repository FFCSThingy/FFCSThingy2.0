import { configureStore } from '@reduxjs/toolkit';

import rootReducer, { RootState } from './rootReducer';
import throttle from './throttle';

const loadState = () => {
	try { // localStorage can throw errors
		// Get state from localStorage
		const serializedState = localStorage.getItem('state');

		// If state isn't save, return undefined
		// State will be processed by reducers instead
		if (serializedState === null) {
			return undefined;
		}

		// Parse state and return
		return JSON.parse(serializedState);
	} catch (err) {
		// Better safe than sorry
		// Prevents app crashes. Reducers can handle it.
		return undefined;
	}
};

const saveState = (state: RootState) => {
	try {
		const serializedState = JSON.stringify(state);
		localStorage.setItem('state', serializedState);
	} catch {
		// ignore write errors
	}
};

const preloadedState = loadState();
const store = configureStore({
	reducer: rootReducer,
	preloadedState,
});

store.subscribe(throttle(() => {
	const state = { ...store.getState() };

	// Don't set auth in store
	// state = {};
	delete state.auth;
	delete state.user;

	saveState(state);
}, 2000));

export type AppDispatch = typeof store.dispatch;

export default store;
