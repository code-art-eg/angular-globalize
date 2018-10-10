import { CurrentCultureService, GlobalizationService } from "../../src/module";
import { CldrService } from "../../src/services/cldr.service";
import "./load-globalize-data";

import { expect } from "chai";

describe("Globalization duration formatting", () => {

    const cultureService = new CurrentCultureService(["en-GB"]);

    const service = new GlobalizationService(new CldrService(), cultureService);

    it("formats duration null or undefined", () => {
        expect(service.formatDuration(null)).empty;
        expect(service.formatDuration(undefined)).empty;
        expect(service.formatDuration(null, { style: "constant" })).empty;
        expect(service.formatDuration(undefined, { style: "constant" })).empty;

        expect(service.formatDuration(null, "de", { style: "constant" })).empty;
        expect(service.formatDuration(undefined, "de", { style: "constant" })).empty;
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
