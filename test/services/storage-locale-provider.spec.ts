import { StorageLocaleProvider, CANG_DEFAULT_LOCALE_KEY } from '../../src/module';

import { expect } from 'chai';

describe("Storage Locale Provider", () => {
    const testValue = 'en-GB';
    const localStorage = global['localStorage'] as Storage;
    const sessionStorage = global['sessionStorage'] as Storage;

    it("can write", () => {
        const service = new StorageLocaleProvider();
        expect(service.canWrite).true;
    });

    function testGetAndSet(service: StorageLocaleProvider, usedStorage: Storage, nonUsedStorage: Storage, key: string): void {
        usedStorage.clear();
        nonUsedStorage.clear();
        
        expect(usedStorage.length).equals(0);
        expect(nonUsedStorage.length).equals(0);
        
        service.locale = testValue;
        
        expect(service.locale).equals(testValue);
        expect(usedStorage.getItem(key)).equals(testValue);
        expect(usedStorage.length).equals(1);
        expect(nonUsedStorage.length).equals(0);

        service.locale = null;
        expect(usedStorage.length).equals(0);
        expect(nonUsedStorage.length).equals(0);
        
        service.locale = '';
        expect(usedStorage.length).equals(0);
        expect(nonUsedStorage.length).equals(0);

        service.locale = undefined;
        expect(usedStorage.length).equals(0);
        expect(nonUsedStorage.length).equals(0);
    }

    it("get and set works local storage", () => {
        const service = new StorageLocaleProvider();
        testGetAndSet(service, localStorage, sessionStorage, CANG_DEFAULT_LOCALE_KEY);
    });

    it("get and set works session storage", () => {
        const service = new StorageLocaleProvider(undefined, true);
        testGetAndSet(service, sessionStorage, localStorage, CANG_DEFAULT_LOCALE_KEY);
    });

    it("get and set works local storage non default key", () => {
        const key = 'testKey';
        const service = new StorageLocaleProvider(key);
        testGetAndSet(service, localStorage, sessionStorage, key);
    });

    it("get and set works session storage non default key", () => {
        const key = 'testKey';
        const service = new StorageLocaleProvider(key, true);
        testGetAndSet(service, sessionStorage, localStorage, key);
    });

    it("works when local storage is undefined", () => {
        global['localStorage'] = undefined;
        global['sessionStorage'] = undefined;
        const service = new StorageLocaleProvider();
        expect(service.locale).null;
        service.locale = testValue;
        expect(service.locale).null;
        global['localStorage'] = localStorage;
        global['sessionStorage'] = sessionStorage;
    });
});