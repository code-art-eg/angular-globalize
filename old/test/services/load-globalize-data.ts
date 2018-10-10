import * as Globalize from "globalize";

function loadData() {

    Globalize.loadTimeZone(require("iana-tz-data/iana-tz-data.json"));

    Globalize.load(require("cldr-data/supplemental/metaZones.json"));
    Globalize.load(require("cldr-data/supplemental/timeData.json"));
    Globalize.load(require("cldr-data/supplemental/weekData.json"));

    Globalize.load(require("cldr-data/supplemental/currencyData.json"));
    Globalize.load(require("cldr-data/supplemental/plurals.json"));

    Globalize.load(require("cldr-data/main/en-GB/numbers.json"));
    Globalize.load(require("cldr-data/main/en-GB/ca-gregorian.json"));
    Globalize.load(require("cldr-data/main/en-GB/timeZoneNames.json"));
    Globalize.load(require("cldr-data/main/en-GB/currencies.json"));
    Globalize.load(require("cldr-data/main/en-GB/posix.json"));

    Globalize.load(require("cldr-data/main/de/ca-gregorian.json"));
    Globalize.load(require("cldr-data/main/de/timeZoneNames.json"));
    Globalize.load(require("cldr-data/main/de/numbers.json"));
    Globalize.load(require("cldr-data/main/de/currencies.json"));
    Globalize.load(require("cldr-data/main/de/posix.json"));

    Globalize.load(require("cldr-data/main/ar-EG/ca-gregorian.json"));
    Globalize.load(require("cldr-data/main/ar-EG/timeZoneNames.json"));
    Globalize.load(require("cldr-data/main/ar-EG/numbers.json"));
    Globalize.load(require("cldr-data/main/ar-EG/currencies.json"));
    Globalize.load(require("cldr-data/main/ar-EG/posix.json"));
}

loadData();
