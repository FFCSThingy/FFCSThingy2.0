import React from 'react';
import { Toast, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FaCalendar, FaFire, FaSync } from 'react-icons/fa';
import { useSelector } from 'react-redux';

import { selectIsTimetableSyncing } from '../../selectors/timetable';
import { selectIsHeatmapSyncing } from '../../selectors/course';
import styles from '../../css/Toasts.module.scss';

const TimetableIcon = () => (
	<OverlayTrigger
		key="TimetableSync-Overlay"
		placement="bottom"
		trigger={['hover']}
		overlay={(
			<Tooltip id="TimetableSync-Tooltip">
						Syncing Timetable
			</Tooltip>
		)}
	>
		<FaCalendar
			className={styles.timetableIcon}
		/>
	</OverlayTrigger>
);

const HeatmapIcon = () => (
	<OverlayTrigger
		key="HeatmapSync-Overlay"
		placement="bottom"
		trigger={['hover']}
		overlay={(
			<Tooltip id="HeatmapSync-Tooltip">
						Syncing Heatmap
			</Tooltip>
		)}
	>
		<FaFire
			className={styles.heatmapIcon}
		/>
	</OverlayTrigger>
);

const SyncToast = () => {
	const isTimetableSyncing = useSelector(selectIsTimetableSyncing);
	const isHeatmapSyncing = useSelector(selectIsHeatmapSyncing);

	return	(
		<Toast
			show={isTimetableSyncing || isHeatmapSyncing}
		>
			<Toast.Body>
				<FaSync
					className={styles.syncIcon}
				/>
				{
					isTimetableSyncing
						? <TimetableIcon />
						: <></>
				}

				{
					isHeatmapSyncing
						? <HeatmapIcon />
						: <></>
				}
			</Toast.Body>
		</Toast>
	);
};

const Toasts = () => (
	<div className={styles.toastContainer}>
		<SyncToast />
	</div>
);

export default Toasts;
