import { mount } from "enzyme";
import React from 'react';
import DemoComponentHiddenLightbox from "../../demo/DemoComponentHiddenLightbox";
import FsLightbox from "../../src/FsLightbox";
import { testUrls } from "../schemas/testSchemas";

const demoComponent = mount(<DemoComponentHiddenLightbox/>);

describe('Test FsLightbox component props', () => {
    const buttonTogglingOpen = demoComponent.find('button').at(0);
    const fsLightbox = demoComponent.find('FsLightbox');

    const closeOpenLightbox = fsLightbox.instance().closeOpenLightbox;
    closeOpenLightbox.openLightbox = jest.fn();
    closeOpenLightbox.closeLightbox = jest.fn();

    it('should open lightbox and add class to document element', () => {
        buttonTogglingOpen.simulate('click');
        expect(fsLightbox.instance().props.isOpen).toBeTruthy();
        expect(closeOpenLightbox.openLightbox).toHaveBeenCalled();
    });

    it('should call lightbox initialize that was closed at start', () => {
        const fsLightbox = mount(<FsLightbox isOpen={ false } urls={ testUrls }/>);
        fsLightbox.instance().initialize = jest.fn();
        fsLightbox.instance().closeOpenLightbox.openLightbox();
        expect(fsLightbox.instance().initialize).toBeCalled();
    });
});