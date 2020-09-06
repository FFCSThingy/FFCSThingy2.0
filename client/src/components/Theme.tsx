import React, { useEffect } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { RootState } from '../app/rootReducer';

const mapStateToProps = (state: RootState) => ({ theme: state.misc.theme });
const mapDispatch = {};

const connector = connect(mapStateToProps, mapDispatch);
type PropsFromRedux = ConnectedProps<typeof connector>;

const Theme = (props: PropsFromRedux) => {
	useEffect(() => {
		document.documentElement.className = '';
		localStorage.setItem('theme', props.theme);
		document.documentElement.classList.add(`theme-${props.theme}`);
	}, [props.theme]);

	return <></>;
};

export default connector(Theme);
