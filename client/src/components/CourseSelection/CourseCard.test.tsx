import React from 'react';
import { render, fireEvent, waitFor, screen, getByTitle } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import CourseCard from './CourseCard';

import { initialState } from '../../app/rootReducer';
import { selectCourse } from '../../reducers/course';

const mockStore = configureStore([thunk]);
const store = mockStore(initialState);

const props = {
    code: 'ZZZ1001',
    title: 'Sample1',
    credits: 4,
    shortCourseTypes: ['L', 'T', 'P'],
    selected: false,
    prereqs: {},
};

describe('component: CourseCard', () => {
    afterEach(() => {
        store.clearActions();
    });

    describe('snapshots', () => {
        it('not-selected, no-prereq, no-completed, >1 credit, >1 courseType', () => {
            const { asFragment } = render(
                <Provider store={store}>
                    <CourseCard 
                        code={props.code}
                        title={props.title}
                        credits={props.credits}
                        shortCourseTypes={props.shortCourseTypes}
                        selected={props.selected}
                        prereqs={props.prereqs}
                    />
                </Provider>
            );

            expect(asFragment()).toMatchSnapshot();
        });

        it('selected-not-passed, no-prereq, no-completed, >1 credit, >1 courseType', () => {
            const { asFragment } = render(
                <Provider store={store}>
                    <CourseCard 
                        code={props.code}
                        title={props.title}
                        credits={props.credits}
                        shortCourseTypes={props.shortCourseTypes}
                        prereqs={props.prereqs}
                    />
                </Provider>
            );

            expect(asFragment()).toMatchSnapshot();
        });

        it('not-passed, prereq-not-passed, no-completed, >1 credit, >1 courseType', () => {
            const { asFragment } = render(
                <Provider store={store}>
                    <CourseCard 
                        code={props.code}
                        title={props.title}
                        credits={props.credits}
                        shortCourseTypes={props.shortCourseTypes}
                        selected={props.selected}
                    />
                </Provider>
            );

            expect(asFragment()).toMatchSnapshot();
        });

        it('selected, no-prereq, no-completed, >1 credit, >1 courseType', () => {
            const { asFragment } = render(
                <Provider store={store}>
                    <CourseCard 
                        code={props.code}
                        title={props.title}
                        credits={props.credits}
                        shortCourseTypes={props.shortCourseTypes}
                        selected={true}
                        prereqs={props.prereqs}
                    />
                </Provider>
            );

            expect(asFragment()).toMatchSnapshot();
        });

        it('not-selected, no-prereq, no-completed, 1 credit, >1 courseType', () => {
            const { asFragment } = render(
                <Provider store={store}>
                    <CourseCard 
                        code={props.code}
                        title={props.title}
                        credits={1}
                        shortCourseTypes={props.shortCourseTypes}
                        selected={props.selected}
                        prereqs={props.prereqs}
                    />
                </Provider>
            );

            expect(asFragment()).toMatchSnapshot();
        });

        it('not-selected, no-prereq, no-completed, >1 credit, 1 courseType', () => {
            const { asFragment } = render(
                <Provider store={store}>
                    <CourseCard 
                        code={props.code}
                        title={props.title}
                        credits={props.credits}
                        shortCourseTypes={['L']}
                        selected={props.selected}
                        prereqs={props.prereqs}
                    />
                </Provider>
            );

            expect(asFragment()).toMatchSnapshot();
        });

        it('not-selected, no-prereq, completed-pass, >1 credit, >1 courseType', () => {
            const { asFragment } = render(
                <Provider store={store}>
                    <CourseCard 
                        code={props.code}
                        title={props.title}
                        credits={props.credits}
                        shortCourseTypes={props.shortCourseTypes}
                        selected={props.selected}
                        prereqs={props.prereqs}
                        completed="A"
                    />
                </Provider>
            );

            expect(asFragment()).toMatchSnapshot();
        });

        it('not-selected, no-prereq, completed-fail, >1 credit, >1 courseType', () => {
            const { asFragment } = render(
                <Provider store={store}>
                    <CourseCard 
                        code={props.code}
                        title={props.title}
                        credits={props.credits}
                        shortCourseTypes={props.shortCourseTypes}
                        selected={props.selected}
                        prereqs={props.prereqs}
                        completed="F"
                    />
                </Provider>
            );

            expect(asFragment()).toMatchSnapshot();
        });

        // Tooltip does not show up in snapshots
        it.todo('not-selected, prereq, no-completed, >1 credit, >1 courseType');
    });

    it(`should dispatch ${selectCourse} on click`, () => {
        render(
            <Provider store={store}>
                <CourseCard 
                    code={props.code}
                    title={props.title}
                    credits={props.credits}
                    shortCourseTypes={props.shortCourseTypes}
                    selected={props.selected}
                    prereqs={props.prereqs}
                />
            </Provider>
        );

        fireEvent.click(screen.getByTitle(props.code));

        const actions = store.getActions();
        const selectAction = actions.find((v) => v.type === selectCourse.type);
        expect(selectAction.payload).toStrictEqual(props.code);
    })
});