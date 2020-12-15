import React, { useState, memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Dropdown, ButtonGroup, Button } from 'react-bootstrap';
import {
	FaTrashAlt, FaPlusSquare, FaPen, FaCopy, FaCamera, FaFileDownload,
} from 'react-icons/fa';
import domToImage from 'dom-to-image';

import styles from '../../css/TimetableSwitcher.module.scss';

import TimetableSwitcherInput from './TimetableSwitcherInput';

import {
	changeTimetable,
	addTimetable,
	removeTimetable,
	renameTimetable,
	copyTimetable,
} from '../../reducers/timetable';
import {
	selectActiveTimetableName,
	selectFilteredTimetable,
	selectTimetableNames,
} from '../../selectors/timetable';

const TimetableSwitcher = memo(() => {
	const dispatch = useDispatch();

	const timetableNames = useSelector(selectTimetableNames);
	const activeTimetableName = useSelector(selectActiveTimetableName);
	const timetable = useSelector(selectFilteredTimetable);

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

	const handleTimetableDownload = async () => {
		const timetableElement = document.getElementById('timetable') as HTMLElement;
		const imgData = await domToImage.toPng(timetableElement);

		const downloadLink = document.createElement('a');
		downloadLink.href = imgData;
		downloadLink.download = `FFCSThingy Timetable - ${activeTimetableName}.png`;
		downloadLink.target = '_blank';
		downloadLink.click();
	};

	const handleCourseCsvDownload = async () => {
		const fields = ['code', 'title', 'course_type', 'credits', 'slot', 'venue', 'faculty'];
		const fieldsString = fields.join(',');
		const details = timetable.map(
			(course) => fields.map(
				(field) => Object(course)[field],
			).join(','),
		).join('\n');

		const csv = `${fieldsString}\n${details}`;

		const downloadLink = document.createElement('a');
		downloadLink.href = `data:text/csv;charset=utf-8,${encodeURI(csv)}`;
		downloadLink.download = `FFCSThingy courses - ${activeTimetableName}.csv`;
		downloadLink.target = '_blank';
		downloadLink.click();
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

				<Dropdown
					onSelect={
						(selected: string) => dispatch(changeTimetable(selected))
					}
				>
					<Dropdown.Toggle
						id="DropdownToggle"
						className={styles.dropdownButton}
						title="Switch Timetable"
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
					title="New Timetable"
				>
					<FaPlusSquare />
				</Button>

				<Button
					className={styles.button}
					onClick={() => handleAction('Copy')}
					title="Copy Timetable"
				>
					<FaCopy />
				</Button>

				<Button
					className={styles.button}
					onClick={() => handleAction('Edit')}
					disabled={activeTimetableName === 'Default'}
					title="Edit Timetable"
				>
					<FaPen />
				</Button>

				<Button
					className={styles.button}
					onClick={() => handleAction('Delete')}
					disabled={activeTimetableName === 'Default'}
					title="Delete Timetable"
				>
					<FaTrashAlt />
				</Button>

				<Button
					className={styles.button}
					onClick={() => handleTimetableDownload()}
					title="Download Timetable as Image"
				>
					<FaCamera />
				</Button>

				<Button
					className={styles.button}
					onClick={() => handleCourseCsvDownload()}
					title="Download Timetable as CSV"
				>
					<FaFileDownload />
				</Button>

			</ButtonGroup>

			<TimetableSwitcherInput
				value={defaultValue()}
				okHandler={okHandler}
				showInput={showInput()}
			/>

		</div>
	);
});

export default TimetableSwitcher;
