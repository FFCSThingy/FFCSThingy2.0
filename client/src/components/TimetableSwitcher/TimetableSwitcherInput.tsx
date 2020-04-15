import React, { useState, useEffect, FC } from 'react';
import { Button, Form, } from 'react-bootstrap';

import TimetableSwitcherInputProps from '../../models/components/TimetableSwitcher/TimetableSwitcherInput';

import styles from '../../css/TimetableSwitcher.module.scss';


const TimetableSwitcherInput: FC<TimetableSwitcherInputProps> = (
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

export default TimetableSwitcherInput;