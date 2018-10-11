import { CurrentCultureService } from "@code-art/angular-globalize";
import { expect } from "chai";
import { NextPreviousComponent } from "../../src/components/next-prev.component";

describe("NextPreviousComponent", () => {
    const cultureService = new CurrentCultureService(["en-GB", "ar-EG", "de"]);

    it("inits correctly", () => {
        const c = new NextPreviousComponent(cultureService);
        expect(c.locale).null;
        expect(c.text).null;
        expect(c.resetButton).true;
        expect(c.homeButton).true;
    });

    it("gets correct arrows", () => {
        const c = new NextPreviousComponent(cultureService);
        expect(c.isRtl).false;
        c.locale = "en-GB";
        expect(c.isRtl).false;
        c.locale = "ar";
        expect(c.isRtl).true;
    });
});
