import { globalizeStatic } from "../../src/module";

export const loadedGlobalize = ((globalize: GlobalizeStatic): GlobalizeStatic => {

    globalize.loadTimeZone(require("iana-tz-data/iana-tz-data.json"));

    globalize.load(require("cldr-data/supplemental/metaZones.json"));
    globalize.load(require("cldr-data/supplemental/timeData.json"));
    globalize.load(require("cldr-data/supplemental/weekData.json"));

    globalize.load(require("cldr-data/supplemental/currencyData.json"));
    globalize.load(require("cldr-data/supplemental/plurals.json"));

    globalize.load(require("cldr-data/main/en-GB/numbers.json"));
    globalize.load(require("cldr-data/main/en-GB/ca-gregorian.json"));
    globalize.load(require("cldr-data/main/en-GB/timeZoneNames.json"));
    globalize.load(require("cldr-data/main/en-GB/currencies.json"));

    globalize.load(require("cldr-data/main/de/ca-gregorian.json"));
    globalize.load(require("cldr-data/main/de/timeZoneNames.json"));
    globalize.load(require("cldr-data/main/de/numbers.json"));
    globalize.load(require("cldr-data/main/de/currencies.json"));

    globalize.load(require("cldr-data/main/ar-EG/ca-gregorian.json"));
    globalize.load(require("cldr-data/main/ar-EG/timeZoneNames.json"));
    globalize.load(require("cldr-data/main/ar-EG/numbers.json"));
    globalize.load(require("cldr-data/main/ar-EG/currencies.json"));
    return globalize;
})(globalizeStatic);
