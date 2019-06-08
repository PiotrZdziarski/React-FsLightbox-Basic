import { SOURCES_TYPES_KEY } from "../../../constants/localStorageConstants";

/**
 * @constructor
 */
export function CreatingSourcesLocalStorageManager(fsLightbox) {
    const NOT_YET_DETECTED = false;
    let decodedSourceTypes;
    let newSourceTypesToDetect = 0;
    const newTypes = {};

    this.getSourceTypeFromLocalStorageByUrl = (url) => {
        if (!decodedSourceTypes[url]) {
            return addNewUrlToDetect(url);
        }
        return decodedSourceTypes[url];
    };

    this.handleReceivedSourceTypeForUrl = (sourceType, url) => {
        if (newTypes[url] !== undefined) {
            newSourceTypesToDetect--;
            newTypes[url] = sourceType;
            ifAllNewTypesAreDetectedStoreAllTypesToLocalStorage();
        }
    };

    const setUp = () => {
        if (!fsLightbox.props.disableLocalStorage) {
            decodedSourceTypes = JSON.parse(localStorage.getItem(SOURCES_TYPES_KEY));
            // we are checking if detected source types contains at certain key source type
            // when localStorage will be empty we can overwrite this method because we are sure
            // that at every index will be no source type
            if (!decodedSourceTypes) {
                // in ifAllNewTypesAreDetectedStoreAllTypesToLocalStorage we are assigning to
                // decodedSourceTypes new Types so we need to make it an object to avoid errors
                decodedSourceTypes = {};
                this.getSourceTypeFromLocalStorageByUrl = addNewUrlToDetect;
            }
        } else {
            this.getSourceTypeFromLocalStorageByUrl = function () {};
            this.handleReceivedSourceTypeForUrl = function () {};
        }
    };

    const addNewUrlToDetect = (url) => {
        newSourceTypesToDetect++;
        newTypes[url] = NOT_YET_DETECTED;
    };

    const ifAllNewTypesAreDetectedStoreAllTypesToLocalStorage = () => {
        if (newSourceTypesToDetect === 0) {
            Object.assign(decodedSourceTypes, newTypes);
            localStorage.setItem(SOURCES_TYPES_KEY, JSON.stringify(decodedSourceTypes));
        }
    };

    setUp();
}
