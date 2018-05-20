import { throws } from "assert";
import { expect } from "chai";
import { CurrentCultureService, GlobalizationService, TypeConverterService } from "../../src/module";
import { CldrService } from "../../src/services/cldr.service";
import "./load-globalize-data";

// tslint:disable-next-line
const chai: Chai.ChaiStatic = require("chai");
// tslint:disable-next-line
chai.use(require("chai-datetime"));

describe("Conversion Service", () => {

    const mockCultureService = new CurrentCultureService(["en-GB"]);

    const globalizeService = new GlobalizationService(new CldrService(), mockCultureService);
    const typeConverter = new TypeConverterService(globalizeService);

    it("converts null to string", () => {
        expect(typeConverter.convertToString(null)).equal("");
    });

    it("converts undefined to string", () => {
        expect(typeConverter.convertToString(undefined)).equal("");
    });

    it("converts number to string", () => {
        expect(typeConverter.convertToString(123)).equal("123");
    });

    it("converts true to string", () => {
        expect(typeConverter.convertToString(true)).equal("true");
    });

    it("converts false to string", () => {
        expect(typeConverter.convertToString(false)).equal("false");
    });

    it("converts date to string", () => {
        expect(typeConverter.convertToString(new Date(2018, 1, 18))).equal("18/02/2018, 00:00");
    });

    it("converts date to string locale", () => {
        expect(typeConverter.convertToString(new Date(2018, 1, 18), "de")).equal("18.02.18, 00:00");
    });

    it("converts string to string", () => {
        const test = "sss";
        expect(typeConverter.convertToString(test)).equal(test);
    });

    it("converts object to string", () => {
        const obj = {
            toString: (): string => "x",
        };
        expect(typeConverter.convertToString(obj)).equal("x");
    });

    it("converts null to boolean", () => {
        expect(typeConverter.convertToBoolean(null)).false;
    });

    it("converts undefined to boolean", () => {
        expect(typeConverter.convertToBoolean(undefined)).false;
    });

    it("converts zero to boolean", () => {
        expect(typeConverter.convertToBoolean(0)).false;
    });

    it("converts number to boolean", () => {
        expect(typeConverter.convertToBoolean(-5)).true;
    });

    it("converts boolean to boolean", () => {
        expect(typeConverter.convertToBoolean(true)).true;
        expect(typeConverter.convertToBoolean(false)).false;
    });

    it("converts string to boolean", () => {
        expect(typeConverter.convertToBoolean("False")).false;
        expect(typeConverter.convertToBoolean("true")).true;
        expect(typeConverter.convertToBoolean("0")).false;
        expect(typeConverter.convertToBoolean("1")).false;
    });

    it("fails to converts object to boolean ", () => {
        throws(() => typeConverter.convertToBoolean(new Date()));
    });

    it("converts null to number", () => {
        expect(typeConverter.convertToNumber(null)).null;
    });

    it("converts undefined to number", () => {
        expect(typeConverter.convertToNumber(undefined)).null;
    });

    it("converts false to number", () => {
        expect(typeConverter.convertToNumber(false)).equal(0);
    });

    it("converts true to number", () => {
        expect(typeConverter.convertToNumber(true)).equal(1);
    });

    it("converts Date to number", () => {
        const d = new Date();
        expect(typeConverter.convertToNumber(d)).equal(d.valueOf());
    });

    it("converts number to number", () => {
        const n = 123;
        expect(typeConverter.convertToNumber(n)).equal(n);
    });

    it("converts string to number", () => {
        const n = 123;
        expect(typeConverter.convertToNumber("123")).equal(n);
    });

    it("converts string to number locale", () => {
        const n = 123.2;
        expect(typeConverter.convertToNumber("123,2", "de")).equal(n);
    });

    it("converts number to string", () => {
        const n = 123;
        expect(typeConverter.convertToString(n)).equal("123");
    });

    it("converts number to string locale", () => {
        const n = 123.5;
        expect(typeConverter.convertToString(n, "de")).equal("123,5");
    });

    it("fails to converts object to number ", () => {
        throws(() => typeConverter.convertToBoolean({}));
    });

    it("converts null to date", () => {
        expect(typeConverter.convertToDate(null)).null;
    });

    it("converts undefined to date", () => {
        expect(typeConverter.convertToDate(undefined)).null;
    });

    it("converts string to date", () => {
        const d = new Date(2018, 1, 18, 20, 12);
        expect(typeConverter.convertToDate("18/02/2018")).equalDate(d);
        expect(typeConverter.convertToDate("18/02/2018, 20:12")).equalTime(d);
    });

    it("converts string to date locale", () => {
        const d = new Date(2018, 1, 18, 20, 12);
        expect(typeConverter.convertToDate("18.02.2018", "de")).equalDate(d);
        expect(typeConverter.convertToDate("18.02.18, 20:12", "de")).equalTime(d);
        expect(typeConverter.convertToDate("18.02.2018, 20:12:00", "de")).equalTime(d);
    });

    it("converts date to date", () => {
        const d = new Date(2018, 1, 18);
        expect(typeConverter.convertToDate(d)).equalTime(d);
    });

    it("fails to convert object to date", () => {
        throws(() => typeConverter.convertToDate({}));
    });

});
