import { CurrentCultureService} from "@code-art/angular-globalize";
import { expect } from "chai";
import { NextPreviousComponent } from "../../src/components/next-prev.component";

describe("NextPreviousComponent", () => {
    const cultureService = new CurrentCultureService(["en-GB", "ar-EG", "de"]);

    it("inits correctly", () => {
        const c = new NextPreviousComponent(cultureService);
        expect(c.locale).null;
        expect(NextPreviousComponent.leftArrow).not.equal(NextPreviousComponent.rightArrow);
        expect(c.text).null;
        expect(c.resetButton).true;
        expect(c.homeButton).true;
    });

    it("gets correct arrows", () => {
        const c = new NextPreviousComponent(cultureService);
        expect(c.getClass("next")).equal(NextPreviousComponent.rightArrow);
        expect(c.getClass("prev")).equal(NextPreviousComponent.leftArrow);
        c.locale = "en-GB";
        expect(c.getClass("next")).equal(NextPreviousComponent.rightArrow);
        expect(c.getClass("prev")).equal(NextPreviousComponent.leftArrow);
        c.locale = "ar";
        expect(c.getClass("next")).equal(NextPreviousComponent.leftArrow);
        expect(c.getClass("prev")).equal(NextPreviousComponent.rightArrow);
    });
});
