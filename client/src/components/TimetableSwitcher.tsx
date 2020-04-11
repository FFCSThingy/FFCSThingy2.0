import React, { useState, useEffect, memo, FC } from 'react';
import {
	Dropdown, ButtonGroup, Button, Form,
} from 'react-bootstrap';
import { SelectCallback } from 'react-bootstrap/helpers';
import {
	FaTrashAlt, FaPlusSquare, FaPen, FaCopy,
} from 'react-icons/fa';
import styles from '../css/TimetableSwitcher.module.scss';


interface TimetableInput {
	value: string;
	okHandler: Function;
	showInput: boolean;
}

const TimetableInput: FC<TimetableInput> = (
	{ value = '', okHandler, showInput }
) => {
	const [newTimetableName, setNewTimetableName] = useState(value);
	useEffect(() => {	// update default value on show and value change
		setNewTimetableName(value);
	}, [value, showInput]);

	const handleSubmit = () => okHandler(newTimetableName);

	const handleKeyPress = (target: React.KeyboardEvent<HTMLFormElement>) => {
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
				onChange={
					(e: React.ChangeEvent<HTMLInputElement>) => setNewTimetableName(e.currentTarget.value)
				}
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

interface DropdownItem {
	value: string;
}

const DropdownItem: FC<DropdownItem> = ({ value }) => (
	<Dropdown.Item
		eventKey={value}
		className={styles.dropdownItem}
	>
		{value}
	</Dropdown.Item>
);

interface TimetableSwitcher {
	timetableNames: string[];
	activeTimetableName: string;
	setActiveTimetableName: SelectCallback;
	doNew: Function;
	doEdit: Function;
	doDelete: Function;
	doCopy: Function;
}

const TimetableSwitcher: FC<TimetableSwitcher> = memo(
	({
		timetableNames, activeTimetableName, setActiveTimetableName, doNew, doEdit, doDelete, doCopy,
	}) => {
		const [action, setAction] = useState('');

		const okHandler = (value: string) => {
			switch (action) {
				case 'New':
					doNew(value);
					setAction('');
					break;

				case 'Edit':
					doEdit(value);
					setAction('');
					break;

				case 'Copy':
					doCopy(value);
					setAction('');
					break;

				default: break;
			}
		};

		const handleAction = (inputAction: string) => {
			if (inputAction === 'Delete') doDelete();
			else if (inputAction === action) setAction('');
			else setAction(inputAction);
		};

		const showInput = () => ['New', 'Edit', 'Copy'].includes(action);

		const defaultValue = () => {
			if (action === 'New') return '';
			return activeTimetableName;
		};

		const dropdownItems = timetableNames.map((v) => (
			<DropdownItem key={`TimetableSwitcherDropdownItem-${v}`} value={v} />
		));


		return (
			<div className={styles.dropdownButtonGroupContainer}>
				<ButtonGroup className={styles.dropdownButtonGroup}>

					<Dropdown onSelect={setActiveTimetableName}>
						<Dropdown.Toggle id="DropdownToggle" className={styles.customDropdownButton}>
							{activeTimetableName}
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
						disabled={activeTimetableName === 'Default'}
					>
						<FaPen />
					</Button>

					<Button
						className={styles.customButton}
						onClick={() => handleAction('Delete')}
						disabled={activeTimetableName === 'Default'}
					>
						<FaTrashAlt />
					</Button>

				</ButtonGroup>

				<TimetableInput value={defaultValue()} okHandler={okHandler} showInput={showInput()} />

			</div>
		);
	}
);

export default TimetableSwitcher;
