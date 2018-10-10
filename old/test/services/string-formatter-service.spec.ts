import { CurrentCultureService, GlobalizationService, StringFormatterService } from "../../src/module";
import { CldrService } from "../../src/services/cldr.service";
import "./load-globalize-data";

import { expect } from "chai";

describe("String formatting", () => {
    const cultureService = new CurrentCultureService(["en-GB"]);
    const cldrService = new CldrService();
    const globalizationService = new GlobalizationService(cldrService, cultureService);
    const service = new StringFormatterService(globalizationService, cldrService, cultureService);

    it("formats strings without arguments", () => {
        expect(service.formatString("Test")).equal("Test");
    });

    it("formats strings with number argument", () => {
        expect(service.formatString("Test: {0}", 1)).equal("Test: 1");
    });

    it("formats strings with number arguments", () => {
        expect(service.formatString("Test: {0} + {1} = {2}", 1, 2, 3)).equal("Test: 1 + 2 = 3");
    });

    it("formats strings with currency", () => {
        expect(service.formatString("Test: {0:CUSD3}!", 1.23456)).equal("Test: US$1.235!");
        expect(service.formatString("Test: {0:cUSD2}!", 1.23456)).equal("Test: US$1.23!");
        expect(service.formatString("Test: {0:cUSD}!", 1.23456)).equal("Test: US$1!");
    });

    it("formats strings with integer", () => {
        expect(service.formatString("Test: {0:d3}!", 1)).equal("Test: 001!");
        expect(service.formatString("Test: {0:d}!", 1.23456)).equal("Test: 1.234!");
    });

    it("formats strings with fixed decimals", () => {
        expect(service.formatString("Test: {0:f3}!", 1)).equal("Test: 1.000!");
        expect(service.formatString("Test: {0:f3}!", 1.23456)).equal("Test: 1.235!");
        expect(service.formatString("Test: {0:f3}!", 100000.23456)).equal("Test: 100000.235!");
    });

    it("formats strings with grouping decimals", () => {
        expect(service.formatString("Test: {0:n3}!", 1)).equal("Test: 1.000!");
        expect(service.formatString("Test: {0:N3}!", 1.23456)).equal("Test: 1.235!");
        expect(service.formatString("Test: {0:N3}!", 100000.23456)).equal("Test: 100,000.235!");
    });

    it("formats strings with percent", () => {
        expect(service.formatString("Test: {0:p2}!", 1)).equal("Test: 100.00%!");
        expect(service.formatString("Test: {0:p}!", 1.23)).equal("Test: 123%!");
        expect(service.formatString("Test: {0:p}!", 1.234)).equal("Test: 123%!");
        expect(service.formatString("Test: {0:p2}!", 0.226)).equal("Test: 22.60%!");
    });

    it("formats strings with hex", () => {
        expect(service.formatString("Test: {0:x}!", 0x2a)).equal("Test: 2a!");
        expect(service.formatString("Test: {0:X}!", 0xffb)).equal("Test: FFB!");
    });

    it("formats null", () => {
        expect(service.formatString("Test: {0}!", null)).equal("Test: !");
        expect(service.formatString("Test: {0:X}!", undefined)).equal("Test: !");
    });

    it("formats strings", () => {
        expect(service.formatString("Test: {0}!", "Hello")).equal("Test: Hello!");
        expect(service.formatString("Test: {0:X}!", "World")).equal("Test: World!");
    });

    it("formats booleans", () => {
        expect(service.formatString("Test: {0}!", true)).equal("Test: yes!");
        expect(service.formatString("Test: {0:X}!", false)).equal("Test: no!");
    });

    it("formats dates", () => {
        expect(service.formatString("Test: {0}!", new Date(2000, 1, 21))).equal("Test: 21/02/2000!");
        expect(service.formatString("Test: {0:t}!", new Date(2000, 1, 21))).equal("Test: 00:00!");
    });
});
