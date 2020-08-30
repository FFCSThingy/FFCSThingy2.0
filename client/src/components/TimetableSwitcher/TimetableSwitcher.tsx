import React, { useState, memo, FC } from 'react';
import { Dropdown, ButtonGroup, Button } from 'react-bootstrap';
import {
	FaTrashAlt, FaPlusSquare, FaPen, FaCopy,
} from 'react-icons/fa';

import TimetableSwitcherInput from './TimetableSwitcherInput';

import TimetableSwitcherProps from '../../models/components/TimetableSwitcher/TimetableSwitcher';

import styles from '../../css/TimetableSwitcher.module.scss';

const TimetableSwitcher: FC<TimetableSwitcherProps> = memo(
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

		const dropdownItems = timetableNames.map((value) => {
			let className = styles.dropdownItem;
			if (value === activeTimetableName) className = `${styles.dropdownItem} ${styles.selected}`;

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

					<Button
						className={styles.customButton}
						onClick={() => handleAction('Copy')}
					>
						<FaCopy />
					</Button>

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

				<TimetableSwitcherInput value={defaultValue()} okHandler={okHandler} showInput={showInput()} />

			</div>
		);
	},
);

export default TimetableSwitcher;
