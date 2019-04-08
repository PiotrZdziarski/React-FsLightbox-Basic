import { FsLightboxMock } from "../../../../../__mocks__/components/fsLightboxMock";
import { SlideSwipingUpActions } from "../../../../../../src/core/SlideSwiping/Actions/Up/SlideSwipingUpActions";

const fsLightboxMock = new FsLightboxMock();
let fsLightbox = fsLightboxMock.getFsLightbox();
fsLightboxMock.setAllSourceHoldersToDivs();
/** @var { SlideSwipingUpActions } slideSwipingUpActions */
let slideSwipingUpActions;
let swipingProps = {};

const createNewSlideSwipingUpActionsAndCallMethods = () => {
    slideSwipingUpActions = new SlideSwipingUpActions(fsLightbox, swipingProps);
    slideSwipingUpActions.setUpTransformSourceHolders();
    slideSwipingUpActions.runActions();
};

describe('setting stage sources indexes', () => {
    let setStageSourcesIndexes;

    beforeEach(() => {
        setStageSourcesIndexes = jest.fn();
        fsLightbox.data.totalSlides = 3;
        fsLightbox.state.slide = 1;
    });

    describe('setting stage sources indexes for SwipingTransitioner', () => {
        beforeEach(() => {
            fsLightbox.injector.slideSwiping.getSwipingTransitioner = () => ({
                setStageSourcesIndexes: setStageSourcesIndexes,
                addTransitionToCurrentAndPrevious: () => {
                }
            });
            createNewSlideSwipingUpActionsAndCallMethods();
        });

        it('should call setStageSourcesIndexes with stageSourcesIndexes', () => {
            // as there are 3 slides totally and slide is - indexes will be like previous - 2, current - 0, next -1
            expect(setStageSourcesIndexes).toBeCalledWith({
                previous: 2,
                current: 0,
                next: 1
            });
        });
    });

    describe('setting stage sources indexes for SwipingTransitioner', () => {
        beforeEach(() => {
            fsLightbox.injector.slideSwiping.getSwipingSlideChangerForSwipingTransitioner = () => ({
                setStageSourcesIndexes: setStageSourcesIndexes,
                changeSlideToPrevious: () => {
                }
            });
            createNewSlideSwipingUpActionsAndCallMethods();
        });

        it('should call setStageSourcesIndexes with stageSourcesIndexes', () => {
            // as there are 3 slides totally and slide is - indexes will be like previous - 2, current - 0, next -1
            expect(setStageSourcesIndexes).toBeCalledWith({
                previous: 2,
                current: 0,
                next: 1
            });
        });
    });
});

describe('transforming source holders', () => {
    let actions = {
        addTransitionToCurrent: null,
        changeSlideToPrevious: null,
        changeSlideToNext: null,
        transformStageSourceHoldersAtIndex: null,
        transformStageSourceHolders: null,
    };

    beforeEach(() => {
        for (let i in actions) {
            actions[i] = jest.fn();
        }
        fsLightbox.injector.slideSwiping.getSwipingTransitioner = () => ({
            setStageSourcesIndexes: () => {
            },
            addTransitionToCurrent: actions.addTransitionToCurrent,
        });
        fsLightbox.injector.slideSwiping.getSwipingSlideChangerForSwipingTransitioner = () => ({
            setStageSourcesIndexes: () => {
            },
            changeSlideToPrevious: actions.changeSlideToPrevious,
            changeSlideToNext: actions.changeSlideToNext
        });
        fsLightbox.core.sourceHoldersTransformer.transformStageSourceHolderAtIndex = actions.transformStageSourceHoldersAtIndex;
        fsLightbox.core.sourceHoldersTransformer.transformStageSourceHolders = actions.transformStageSourceHolders;
    });

    const itShouldNotCallEverythingExcept = (calledOnesArray) => {
        for (let i in actions) {
            let isCalledOne = false;
            for (let j in calledOnesArray) {
                if (actions[i] === calledOnesArray[j]) {
                    isCalledOne = true;
                }
            }
            if (!isCalledOne) {
                expect(actions[i]).not.toBeCalled();
            }
        }
    };

    const itShouldCallOnce = (toBeCalledArray) => {
        for (let i in toBeCalledArray) {
            expect(toBeCalledArray[i]).toBeCalledTimes(1);
        }
    };

    describe('transforming only current (there is only one slide)', () => {
        let zeroTransform;

        beforeEach(() => {
            zeroTransform = jest.fn();
            swipingProps.swipedDifference = 0;
            fsLightbox.data.totalSlides = 1;
            fsLightbox.core.sourceHoldersTransformer.transformStageSourceHolderAtIndex = jest.fn(() => ({
                zero: zeroTransform
            }));
            actions.transformStageSourceHoldersAtIndex = fsLightbox.core.sourceHoldersTransformer.transformStageSourceHolderAtIndex;
            createNewSlideSwipingUpActionsAndCallMethods();
        });

        it('should call addTransitionToCurrent', () => {
            itShouldCallOnce([actions.addTransitionToCurrent]);
        });

        it('should call transformStageSourceHoldersAtIndex with 0 as param (0 - array index of current source holder)', () => {
            expect(fsLightbox.core.sourceHoldersTransformer.transformStageSourceHolderAtIndex.mock.calls[0][0])
                .toEqual(0);
        });

        it('should call zero on transformStageSourceHoldersAtIndex', () => {
            expect(zeroTransform).toBeCalled();
        });

        it('should not call everything expect addTransitionToCurrent and transformStageSourceHolderAtIndex', () => {
            itShouldNotCallEverythingExcept([
                actions.addTransitionToCurrent,
                actions.transformStageSourceHoldersAtIndex
            ]);
        });
    });

    describe('transforming backward (swiped difference is bigger than 0)', () => {
        beforeEach(() => {
            swipingProps.swipedDifference = 100;
        });

        describe('there are more than two slides', () => {
            beforeEach(() => {
                fsLightbox.data.totalSlides = 3;
                createNewSlideSwipingUpActionsAndCallMethods();
            });

            it('should call changeSlideToPrevious', () => {
                itShouldCallOnce([actions.changeSlideToPrevious]);
            });

            it('should not call everything except changeSlideToPrevious', () => {
                itShouldNotCallEverythingExcept([actions.changeSlideToPrevious]);
            });
        });

        describe('there are only two slides', () => {
            beforeEach(() => {
                fsLightbox.data.totalSlides = 2;
            });

            describe('slide === 1', () => {
                beforeEach(() => {
                    fsLightbox.state.slide = 1;
                    createNewSlideSwipingUpActionsAndCallMethods();
                });

                it('should call addTransitionToCurrent and transformStageSourceHolders', () => {
                    itShouldCallOnce([
                        actions.addTransitionToCurrent,
                        actions.transformStageSourceHolders
                    ]);
                });

                it('should not call everything except addTransitionToCurrent and transformStageSourceHolders', () => {
                    itShouldNotCallEverythingExcept([
                        actions.addTransitionToCurrent,
                        actions.transformStageSourceHolders
                    ])
                });
            });

            describe('slide === 2', () => {
                beforeEach(() => {
                    fsLightbox.state.slide = 2;
                    createNewSlideSwipingUpActionsAndCallMethods();
                });

                it('should call changeSlideToPrevious', () => {
                    itShouldCallOnce([actions.changeSlideToPrevious]);
                });

                it('should not call everything except changeSlideToPrevious', () => {
                    itShouldNotCallEverythingExcept([actions.changeSlideToPrevious]);
                });
            });
        });
    });


    describe('transforming forward (swiped difference is less than 0)', () => {
        beforeEach(() => {
            swipingProps.swipedDifference = -100;
        });

        describe('there are more than two slides', () => {
            beforeEach(() => {
                fsLightbox.data.totalSlides = 3;
                createNewSlideSwipingUpActionsAndCallMethods();
            });

            it('should call changeSlideToPrevious', () => {
                itShouldCallOnce([actions.changeSlideToNext]);
            });

            it('should not call everything except changeSlideToPrevious', () => {
                itShouldNotCallEverythingExcept([actions.changeSlideToNext]);
            });
        });

        describe('there are only two slides', () => {
            beforeEach(() => {
                fsLightbox.data.totalSlides = 2;
            });

            describe('slide === 1', () => {
                beforeEach(() => {
                    fsLightbox.state.slide = 1;
                    createNewSlideSwipingUpActionsAndCallMethods();
                });

                it('should call changeSlideToNext', () => {
                    itShouldCallOnce([actions.changeSlideToNext]);
                });

                it('should not call everything except changeSlideToPrevious', () => {
                    itShouldNotCallEverythingExcept([actions.changeSlideToNext]);
                });
            });

            describe('slide === 2', () => {
                beforeEach(() => {
                    fsLightbox.state.slide = 2;
                    createNewSlideSwipingUpActionsAndCallMethods();
                });

                it('should call addTransitionToCurrent and transformStageSourceHolders', () => {
                    itShouldCallOnce([
                        actions.addTransitionToCurrent,
                        actions.transformStageSourceHolders
                    ]);
                });

                it('should not call everything except addTransitionToCurrent and transformStageSourceHolders', () => {
                    itShouldNotCallEverythingExcept([
                        actions.addTransitionToCurrent,
                        actions.transformStageSourceHolders
                    ])
                });
            });
        });
    })
});

describe('setting isAfterSwipeAnimationRunning from swiping props to true', () => {
    beforeEach(() => {
        swipingProps = {
            isAfterSwipeAnimationRunning: false
        };
        createNewSlideSwipingUpActionsAndCallMethods();
    });

    it('should set isAfterSwipeAnimationRunning to true', () => {
        expect(swipingProps.isAfterSwipeAnimationRunning).toBeTruthy();
    });
});

describe('setting isSwipingSlides state to false', () => {
    beforeEach(() => {
        fsLightbox.state.isSwipingSlides = true;
        createNewSlideSwipingUpActionsAndCallMethods();
    });

    it('should set isAfterSwipeAnimationRunning to true', () => {
        expect(fsLightbox.state.isSwipingSlides).toBeFalsy();
    });
});

describe('setting swiped difference from swiping props to 0', () => {
    beforeEach(() => {
        swipingProps = {
            swipedDifference: 100
        };
        createNewSlideSwipingUpActionsAndCallMethods();
    });

    it('should set isAfterSwipeAnimationRunning to true', () => {
        expect(swipingProps.swipedDifference).toBe(0);
    });
});

describe('setTimeout', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    describe('calling removeAllTransitionsFromStageSources at SwipingTransitioner', () => {
        let removeAllTransitionsFromStageSources;

        beforeEach(() => {
            removeAllTransitionsFromStageSources = jest.fn();
            fsLightbox.injector.slideSwiping.getSwipingTransitioner = () => ({
                removeAllTransitionsFromStageSources: removeAllTransitionsFromStageSources,
                setStageSourcesIndexes: () => {
                },
                addTransitionToCurrentAndPrevious: () => {
                }
            });
            createNewSlideSwipingUpActionsAndCallMethods();
            jest.runAllTimers();
        });

        it('should call removeAllTransitionsFromStageSources', () => {
            expect(removeAllTransitionsFromStageSources).toBeCalled();
        });
    });

    describe('setting isAfterSwipeAnimationRunning to false', () => {
        beforeEach(() => {
            swipingProps = {
                isAfterSwipeAnimationRunning: true
            };
            createNewSlideSwipingUpActionsAndCallMethods();
            jest.runAllTimers();
        });

        it('set isAfterSwipeAnimationRunning to false', () => {
            expect(swipingProps.isAfterSwipeAnimationRunning).toBeFalsy();
        });
    });
});
