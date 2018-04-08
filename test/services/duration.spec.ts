import { DefaultGlobalizationService, ICultureService } from "../../src/module";
import { loadedGlobalize } from "./load-globalize-data";

import { expect } from "chai";

describe("Globalization duration formatting", () => {

    const mockCultureService: ICultureService = {
        cultureObservable: null,
        currentCulture: "en-GB",
        isRightToLeft: null,
    };

    const service = new DefaultGlobalizationService(loadedGlobalize, mockCultureService);

    it("formats duration null or undefined", () => {
        expect(service.formatDuration(null)).null;
        expect(service.formatDuration(undefined)).undefined;
        expect(service.formatDuration(null, { style: "constant" })).null;
        expect(service.formatDuration(undefined, { style: "constant" })).undefined;

        expect(service.formatDuration(null, "de", { style: "constant" })).null;
        expect(service.formatDuration(undefined, "de", { style: "constant" })).undefined;
    });

    it("formats duration using current culture", () => {
        const date1 = new Date(2000, 0, 1, 0, 0, 0, 0);
        const date2 = new Date(2000, 0, 2, 8, 40, 50, 60);
        const num = date2.valueOf() - date1.valueOf();

        expect(service.formatDuration(num)).equal("1:8:40:50.06");
        expect(service.formatDuration(num, { style: "constant" })).equal("1:08:40:50.060");
        expect(service.formatDuration(num, { style: "long" })).equal("1:08:40:50.060");
    });

    it("formats negative duration using current culture", () => {
        const date1 = new Date(2000, 0, 1, 0, 0, 0, 0);
        const date2 = new Date(2000, 0, 2, 8, 40, 50, 60);
        const num = date1.valueOf() - date2.valueOf();

        expect(service.formatDuration(num)).equal("-1:8:40:50.06");
        expect(service.formatDuration(num, { style: "constant" })).equal("-1:08:40:50.060");
        expect(service.formatDuration(num, { style: "long" })).equal("-1:08:40:50.060");
    });

    it("formats negative duration with pattern", () => {
        const date1 = new Date(2000, 0, 1, 0, 0, 0, 0);
        const date2 = new Date(2000, 0, 2, 8, 40, 50, 60);
        const num = date1.valueOf() - date2.valueOf();

        expect(service.formatDuration(num, { pattern: "[-]hh\\ mm" })).equal("-08 40");
        expect(service.formatDuration(num, { pattern: "ss" })).equal("50");
        expect(service.formatDuration(num, { pattern: '"aa"' })).equal("aa");
    });
});
