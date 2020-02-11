import React, { useState, useEffect } from 'react';
import {
	Dropdown, ButtonGroup, Button, Form,
} from 'react-bootstrap';
import { FaTrashAlt, FaPlusSquare, FaPen } from 'react-icons/fa';
import styles from '../css/TimetableSwitcher.module.scss';


const TimetableInput = ({ value = '', okHandler, showInput }) => {
	const [newTimetableName, setNewTimetableName] = useState(value);
	useEffect(() => {	// update default value on show and value change
		setNewTimetableName(value);
	}, [value, showInput]);

	const handleSubmit = () => okHandler(newTimetableName);

	const handleKeyPress = (target) => {
		if (target.charCode === 13) {
			handleSubmit();
		}
	};

	if (!showInput) return <></>;
	return (
		<Form
			className={styles.form}
			onKeyPress={handleKeyPress}
		>
			<Form.Control
				type="text"
				value={newTimetableName}
				placeholder="Timetable Name"
				name="newName"
				onChange={(e) => setNewTimetableName(e.target.value)}
				spellCheck="false"
				autoComplete="off"
				className={styles.inputField}
			/>

			<Button
				className={styles.customButton}
				onClick={handleSubmit}
			>
				Ok
			</Button>
		</Form>
	);
};

const DropdownItem = ({ value }) => (
	<Dropdown.Item
		eventKey={value}
		className={styles.dropdownItem}
	>
		{value}
	</Dropdown.Item>
);

const TimetableSwitcher = ({
	timetableNames, activeTimetable, changeActiveTimetable, doNew, doEdit, doDelete, doCopy,
}) => {
	const [action, setAction] = useState(null);

	const okHandler = (value) => {
		switch (action) {
			case 'New':
				doNew(value);
				setAction(null);
				break;

			case 'Edit':
				doEdit(value);
				setAction(null);
				break;

			case 'Copy':
				doCopy(value);
				setAction(null);
				break;

			default: break;
		}
	};

	const handleAction = (inputAction) => {
		if (inputAction === 'Delete') doDelete();
		else if (inputAction === action) setAction(null);
		else setAction(inputAction);
	};

	const showInput = () => ['New', 'Edit', 'Copy'].includes(action);

	const defaultValue = () => {
		if (action === 'New') return '';
		return activeTimetable;
	};

	const dropdownItems = timetableNames.map((v) => (
		<DropdownItem value={v} />
	));


	return (
		<div className={styles.dropdownButtonGroupContainer}>
			<ButtonGroup className={styles.dropdownButtonGroup}>

				<Dropdown onSelect={changeActiveTimetable}>
					<Dropdown.Toggle className={styles.customDropdownButton}>
						{activeTimetable}
					</Dropdown.Toggle>

					<Dropdown.Menu className={styles.dropdownMenu}>
						{dropdownItems}
					</Dropdown.Menu>
				</Dropdown>

				<Button
					className={styles.customButton}
					onClick={() => handleAction('New')}
				>
					<FaPlusSquare />
				</Button>

				{/* <Button
						className={styles.customButton}
						onClick={() => handleAction('Copy')}
					>
						<FaCopy />
					</Button> */}

				<Button
					className={styles.customButton}
					onClick={() => handleAction('Edit')}
				>
					<FaPen />
				</Button>

				<Button
					className={styles.customButton}
					onClick={() => handleAction('Delete')}
				>
					<FaTrashAlt />
				</Button>

			</ButtonGroup>

			<TimetableInput value={defaultValue()} okHandler={okHandler} showInput={showInput()} />

		</div>
	);
};

export default TimetableSwitcher;
