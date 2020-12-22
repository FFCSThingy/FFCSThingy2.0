import React, { memo, FC } from 'react';
import {
	Col, Container, Form, Row, Nav, ToggleButton, ToggleButtonGroup, OverlayTrigger, Tooltip,
} from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';

import styles from '../../css/CourseSelectionList.module.scss';

import * as COURSE from '../../constants/Courses';

import FilterControlsProps from '../../models/components/CourseSelection/FilterControls';

const FilterControls: FC<FilterControlsProps> = memo(
	({
		setSelectedCategory, setSearchString, typeFilters, setTypeFilters,
		setCreditFilter, tabsDisabled, showPlaceholder,
	}) => {
		const typeButtons = COURSE.simpleTypes.map((v) => (
			<ToggleButton
				value={v}
				className={styles.courseSelectTypeFilter}
				size="sm"
				key={`CourseSelect-CourseFilterToggleButton-${v}`}
			>
				{v}
			</ToggleButton>
		));

		const renderText = () => {
			if (showPlaceholder) { return <div className={styles.codeText} />; }
			return <></>;
		};

		return (
			<Container className={`${styles.searchBarContainer} fluid`}>
				<Row>
					<Col className={styles.searchColumn} xs={12} md={12}>
						<FaSearch className={styles.searchIcon} />
						<OverlayTrigger
							key="SearchBar-Overlay"
							placement="top"
							trigger={['hover', 'focus']}
							overlay={(
								<Tooltip id="CourseSelectTable_SearchBarTooltip">
									<table className={styles.searchTooltip}>
										<thead>
											<tr>
												<th>Prefix</th>
												<th>Search By</th>
											</tr>
										</thead>
										<tbody>
											<tr>
												<td>*</td>
												<td>Faculty</td>
											</tr>
										</tbody>
									</table>
								</Tooltip>
							)}
						>
							<Form.Control
								className={styles.searchBar}
								name="searchString"
								type="text"
								placeholder="Search by"
								spellCheck="false"
								autoComplete="off"
								onChange={
									(e: React.ChangeEvent<HTMLInputElement>) => setSearchString(
										e.target.value,
									)
								}
							/>
						</OverlayTrigger>
						{renderText()}
					</Col>
				</Row>

				<Row>
					<Col xs={6} md={5} lg={6} className={styles.typeFilterCol}>
						<ToggleButtonGroup
							className={styles.typeFilter}
							type="checkbox"
							value={typeFilters}
							onChange={(v: string[]) => setTypeFilters(v)}
						>
							{typeButtons}
						</ToggleButtonGroup>
					</Col>

					<Col xs={6} md={7} lg={6} className={styles.creditFilterCol}>
						<Form.Group as={Row} className={styles.creditFormGroup}>
							<Col xs={6} sm={5} md={7} lg={5}>
								<Form.Label className={styles.creditLabel}>Credits:</Form.Label>
							</Col>

							<Col xs={6} sm={7} md={5} lg={7}>
								<Form.Control
									className={styles.creditField}
									name="creditFilter"
									type="number"
									min="0"
									max="30"
									spellCheck="false"
									autoComplete="off"
									onChange={
										(e: React.ChangeEvent<HTMLInputElement>) => setCreditFilter(
											e.target.value,
										)
									}
								/>
							</Col>
						</Form.Group>
					</Col>
				</Row>

				<Row style={{ padding: '2vh 2vh 0.95px 2vh' }}>
					<Nav
						className={styles.categoryFilterGroup}
						variant="tabs"
						defaultActiveKey="ALL"
						onSelect={(selected: string) => setSelectedCategory(selected)}
					>
						<Nav.Item>
							<Nav.Link
								className={styles.categoryFilterButton}
								eventKey="ALL"
							>
								ALL
							</Nav.Link>
						</Nav.Item>
						<Nav.Item>
							<Nav.Link
								className={styles.categoryFilterButton}
								eventKey="PC"
								disabled={tabsDisabled}
							>
								PC
							</Nav.Link>
						</Nav.Item>
						<Nav.Item>
							<Nav.Link
								className={styles.categoryFilterButton}
								eventKey="UC"
								disabled={tabsDisabled}
							>
								UC
							</Nav.Link>
						</Nav.Item>
						<Nav.Item>
							<Nav.Link
								className={styles.categoryFilterButton}
								eventKey="PE"
								disabled={tabsDisabled}
							>
								PE
							</Nav.Link>
						</Nav.Item>
						<Nav.Item>
							<Nav.Link
								className={styles.categoryFilterButton}
								eventKey="UE"
								disabled={tabsDisabled}
							>
								UE
							</Nav.Link>
						</Nav.Item>
					</Nav>
				</Row>
			</Container>
		);
	},
);

export default FilterControls;
