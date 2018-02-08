import { IGlobalizationService, ICultureService, DefaultGlobalizationService } from '../../src/module';
import { loadedGlobalize } from './load-globalize-data';

import { expect } from 'chai';
const chai: Chai.ChaiStatic = require('chai');
chai.use(require('chai-datetime'));

describe("Globalization date formatting", () => {

    const mockCultureService: ICultureService = {
        currentCulture: 'en-GB',
        cultureObservable: null
    };

    const service = new DefaultGlobalizationService(loadedGlobalize, mockCultureService);
    
    it("should format date null or undefined", () => {
        expect(service.formatDate(null)).null;
        expect(service.formatDate(undefined)).undefined;
        expect(service.formatDate(null, { date: 'short' } )).null;
        expect(service.formatDate(undefined, { date: 'short' } )).undefined;

        expect(service.formatDate(null, 'de', { date: 'short' } )).null;
        expect(service.formatDate(undefined, 'de', { date: 'short' } )).undefined;
    });

    it("should format date using current culture", () => {
        const date = new Date(2018, 1, 18, 19, 45, 57);

        expect(service.formatDate(date)).equal('18/02/2018');
        expect(service.formatDate(date, { date: 'long' })).equal('18 February 2018');
        expect(service.formatDate(date, { datetime: 'short' })).equal('18/02/2018, 19:45');
    });

    it("should format date using provided culture", () => {
        const date = new Date(2018, 1, 18, 19, 45, 57);

        expect(service.formatDate(date, 'de')).equal('18.2.2018');
        expect(service.formatDate(date, 'de', { date: 'long' })).equal('18. Februar 2018');
        expect(service.formatDate(date, 'de', { datetime: 'short' })).equal('18.02.18, 19:45');
    });

    it("should parse date null or undefined", () => {
        expect(service.parseDate(null)).null;
        expect(service.parseDate(undefined)).undefined;
        expect(service.parseDate(null, { date: 'short' } )).null;
        expect(service.parseDate(undefined, { date: 'short' } )).undefined;

        expect(service.parseDate(null, 'de', { date: 'short' } )).null;
        expect(service.parseDate(undefined, 'de', { date: 'short' } )).undefined;
    });

    it("should parse date using current culture", () => {
        const date = new Date(2018, 1, 18, 0, 0, 0);

        expect(service.parseDate(service.formatDate(date))).equalTime(date);
        expect(service.parseDate(service.formatDate(date, { date: 'long' }), { date: 'long' })).equalTime(date);
        expect(service.parseDate(service.formatDate(date, { date: 'short' }), { date: 'short' })).equalTime(date);
    });

   it("should parse date using provided culture", () => {
        const date = new Date(2018, 1, 18, 0, 0, 0);

        expect(service.parseDate(service.formatDate(date, 'de'), 'de')).equalTime(date);
        expect(service.parseDate(service.formatDate(date, 'de', { date: 'long' }), 'de', { date: 'long' })).equalTime(date);
        expect(service.parseDate(service.formatDate(date, 'de', { date: 'short' }), 'de', { date: 'short' })).equalTime(date);
    });
});