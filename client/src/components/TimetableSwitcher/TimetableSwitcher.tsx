import React, { useState, memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Dropdown, ButtonGroup, Button } from 'react-bootstrap';
import {
	FaTrashAlt, FaPlusSquare, FaPen, FaCopy,
} from 'react-icons/fa';

import styles from '../../css/TimetableSwitcher.module.scss';

import TimetableSwitcherInput from './TimetableSwitcherInput';

import {
	changeTimetable,
	addTimetable,
	removeTimetable,
	renameTimetable,
	copyTimetable,
} from '../../reducers/timetable';

import { RootState } from '../../app/rootReducer';

const TimetableSwitcher = memo(() => {
	const dispatch = useDispatch();

	const timetableNames = useSelector(
		(state: RootState) => state.timetable.names,
	);
	const activeTimetableName = useSelector(
		(state: RootState) => state.timetable.active,
	);

	const [action, setAction] = useState('');

	const okHandler = (value: string) => {
		switch (action) {
			case 'New':
				dispatch(addTimetable(value));
				setAction('');
				break;

			case 'Edit':
				dispatch(renameTimetable(value));
				setAction('');
				break;

			case 'Copy':
				dispatch(copyTimetable(value));
				setAction('');
				break;

			default: break;
		}
	};

	const handleAction = (inputAction: string) => {
		if (inputAction === 'Delete') dispatch(removeTimetable());
		else if (inputAction === action) setAction('');
		else setAction(inputAction);
	};

	const showInput = () => ['New', 'Edit', 'Copy'].includes(action);

	const defaultValue = () => {
		if (action === 'New') return '';
		return activeTimetableName;
	};

	const dropdownItems = timetableNames.map((value) => {
		let className = styles.dropdownItem;
		if (value === activeTimetableName) {
			className = `${styles.dropdownItem} ${styles.selected}`;
		}

		return (
			<Dropdown.Item
				key={`TimetableSwitcherDropdownItem-${value}`}
				eventKey={value}
				className={className}
			>
				{value}
			</Dropdown.Item>
		);
	});

	return (
		<div className={styles.dropdownButtonGroupContainer}>
			<ButtonGroup className={styles.dropdownButtonGroup}>

				<Dropdown onSelect={
					(selected: string) => dispatch(changeTimetable(selected))
				}
				>
					<Dropdown.Toggle
						id="DropdownToggle"
						className={styles.dropdownButton}
					>
						{activeTimetableName}
					</Dropdown.Toggle>

					<Dropdown.Menu className={styles.dropdownMenu}>
						{dropdownItems}
					</Dropdown.Menu>
				</Dropdown>

				<Button
					className={styles.button}
					onClick={() => handleAction('New')}
				>
					<FaPlusSquare />
				</Button>

				<Button
					className={styles.button}
					onClick={() => handleAction('Copy')}
				>
					<FaCopy />
				</Button>

				<Button
					className={styles.button}
					onClick={() => handleAction('Edit')}
					disabled={activeTimetableName === 'Default'}
				>
					<FaPen />
				</Button>

				<Button
					className={styles.button}
					onClick={() => handleAction('Delete')}
					disabled={activeTimetableName === 'Default'}
				>
					<FaTrashAlt />
				</Button>

			</ButtonGroup>

			<TimetableSwitcherInput value={defaultValue()} okHandler={okHandler} showInput={showInput()} />

		</div>
	);
});

export default TimetableSwitcher;
