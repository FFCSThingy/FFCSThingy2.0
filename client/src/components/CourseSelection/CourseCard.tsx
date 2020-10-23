import React, { memo, FC } from 'react';
import { Card, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useDispatch } from 'react-redux';

import { selectCourse } from '../../reducers/course';

import styles from '../../css/CourseSelectionList.module.scss';

import CourseCardProps,
{ PrereqTextProps } from '../../models/components/CourseSelection/CourseCard';

const CourseCard: FC<CourseCardProps> = memo(
	({
		code, title, credits, shortCourseTypes,
		completed = '', selected = false, prereqs = null,
	}) => {
		const dispatch = useDispatch();

		const cardClass = selected
			? `${styles.courseCard} ${styles.active}`
			: styles.courseCard;

		const completionClass = ['N', 'F'].includes(completed)
			? styles.cardCompletionFailedSubtitle
			: styles.cardCompletedSubtitle;

		const creditText = (credits === 1) ? 'Credit' : 'Credits';

		const valueMap = (value: string) => value.split(',').map((v) => (
			<React.Fragment key={`${v}`}>
				{v}
				<br />
			</React.Fragment>
		));

		const CoreqText: FC<PrereqTextProps> = ({ value }) => {
			if (value) {
				return (
					<span key={`${code}-Coreq`}>
						<b>Co-Requisites: </b>
						{valueMap(value)}
						<br />
					</span>
				);
			}
			return <></>;
		};

		const PrereqText: FC<PrereqTextProps> = ({ value }) => {
			if (value) {
				return (
					<span key={`${code}-Prereq`}>
						<b>Pre-Requisites: </b>
						{valueMap(value)}
						<br />
					</span>
				);
			}
			return <></>;
		};
		const AntireqText: FC<PrereqTextProps> = ({ value }) => {
			if (value) {
				return (
					<span key={`${code}-Antireq`}>
						<b>Anti-Requisites: </b>
						{valueMap(value)}
						<br />
					</span>
				);
			}
			return <></>;
		};

		const PrereqsTooltip = () => {
			if (prereqs) {
				return (
					<div className={styles.coursePrereq}>
						<PrereqText value={prereqs.prereq || ''} />
						<CoreqText value={prereqs.coreq || ''} />
						<AntireqText value={prereqs.antireq || ''} />
					</div>
				);
			}
			return <></>;
		};

		const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
			dispatch(selectCourse(e.currentTarget.title));
		};

		return (
			<OverlayTrigger
				key={`${code}-Prereq-Overlay`}
				placement="top-start"
				trigger={['hover', 'focus']}
				overlay={(
					<Tooltip id={`${code}-PrereqsTooltip`} role="tooltip">
						<PrereqsTooltip />
						<div className={styles.courseTypes}>
							<b> Course Type: </b>
							{shortCourseTypes.join(' | ')}
						</div>
					</Tooltip>
				)}
			>
				<Card
					className={cardClass}
					onClick={handleClick}
					title={code}	// For using with handleClick
				>
					<Card.Body>
						<Card.Title className={styles.cardTitle}>
							{title}
						</Card.Title>

						<Card.Text className={styles.courseSelectDetails}>
							<span className={styles.courseCodeText}>
								{code}
							</span>

							<span className={styles.courseCredits}>
								{`${credits} ${creditText}`}
							</span>
						</Card.Text>

						<Card.Subtitle className={completionClass}>
							{
								(completed)
									? (`Completed: ${completed}`) : ''
							}
						</Card.Subtitle>
					</Card.Body>
				</Card>
			</OverlayTrigger>
		);
	},
);

export default CourseCard;
