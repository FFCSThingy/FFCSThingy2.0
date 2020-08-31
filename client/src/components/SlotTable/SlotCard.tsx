import React, { FC } from 'react';

import { Card } from 'react-bootstrap';

import styles from '../../css/SlotTable.module.scss';

import SlotCardProps from '../../models/components/SlotTable/SlotCard';

const SlotCard: FC<SlotCardProps> = ({
	slotDetails, onClick, type, clashingSlots, isRelated = false,
}) => {
	let clashSubtitle;
	let selectedSubtitle;
	let relatedSubtitle;
	let cardBodyClass = styles.cardBody;

	if (isRelated) {
		cardBodyClass = styles.cardBodyRelated;
		relatedSubtitle = (
			<Card.Subtitle className={styles.cardRelatedSubtitle}>Related</Card.Subtitle>
		);
	}

	if (type === 'clashing' && clashingSlots) {
		const clashingString = clashingSlots.join(', ');
		cardBodyClass = styles.cardBodyClash;
		clashSubtitle = (
			<Card.Subtitle className={styles.cardClashSubtitle}>
				{'Clashes with '}
				<b>{clashingString}</b>
			</Card.Subtitle>
		);
	}

	if (type === 'selected') {
		cardBodyClass = styles.cardBodySelected;
		selectedSubtitle = (
			<Card.Subtitle className={styles.cardSelectedSubtitle}>Selected</Card.Subtitle>
		);
	}

	return (
		<Card
			className={styles.slotCard}
			key={slotDetails._id}
			onClick={() => ((type === 'normal' && onClick) ? onClick(slotDetails) : null)}
		>

			<Card.Body className={cardBodyClass}>
				<Card.Text className={styles.slotText}>{slotDetails.slot}</Card.Text>
				<Card.Title className={styles.cardTitle}>{slotDetails.faculty}</Card.Title>
				<Card.Subtitle className={styles.cardSubtitle}>
					{`${slotDetails.venue} - ${slotDetails.course_type}`}
				</Card.Subtitle>

				<Card.Subtitle className={styles.cardSubtitle}>
					{'Popularity - '}
					<b>
						{`${Math.floor(slotDetails.percent || 0)}%`}
					</b>
				</Card.Subtitle>

				{
					(type === 'clashing' && clashingSlots)
						? clashSubtitle
						: null
				}

				{
					(type === 'selected' ? selectedSubtitle : null)
				}

				{
					(isRelated ? relatedSubtitle : null)
				}

			</Card.Body>

		</Card>
	);
};

export default SlotCard;
