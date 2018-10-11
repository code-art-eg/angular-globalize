import * as Globalize from 'globalize';
import 'globalize/currency';
import 'globalize/date';
import 'globalize/number';

import timezones from 'iana-tz-data/iana-tz-data.json';

import currencyData from 'cldr-data/supplemental/currencyData.json';
import metaZones from 'cldr-data/supplemental/metaZones.json';
import timeData from 'cldr-data/supplemental/timeData.json';
import weekData from 'cldr-data/supplemental/weekData.json';
import plurals from 'cldr-data/supplemental/plurals.json';

import calendarDe from 'cldr-data/main/de/ca-gregorian.json';
import currencyDe from 'cldr-data/main/de/currencies.json';
import numbersDe from 'cldr-data/main/de/numbers.json';
import timeZonesDe from 'cldr-data/main/de/timeZoneNames.json';
import posixDe from 'cldr-data/main/de/posix.json';

import calendarEn from 'cldr-data/main/en-GB/ca-gregorian.json';
import currencyEn from 'cldr-data/main/en-GB/currencies.json';
import numbersEn from 'cldr-data/main/en-GB/numbers.json';
import timeZonesEn from 'cldr-data/main/en-GB/timeZoneNames.json';
import posixEn from 'cldr-data/main/en-GB/posix.json';

import calendarAr from 'cldr-data/main/ar-EG/ca-gregorian.json';
import currencyAr from 'cldr-data/main/ar-EG/currencies.json';
import numbersAr from 'cldr-data/main/ar-EG/numbers.json';
import timeZonesAr from 'cldr-data/main/ar-EG/timeZoneNames.json';
import posixAr from 'cldr-data/main/ar-EG/posix.json';

export function loadGlobalizeData() {
    Globalize.loadTimeZone(timezones);

    Globalize.load(currencyData);
    Globalize.load(metaZones);
    Globalize.load(timeData);
    Globalize.load(weekData);
    Globalize.load(plurals);

    Globalize.load(numbersDe);
    Globalize.load(calendarDe);
    Globalize.load(timeZonesDe);
    Globalize.load(currencyDe);
    Globalize.load(posixDe);

    Globalize.load(numbersEn);
    Globalize.load(calendarEn);
    Globalize.load(timeZonesEn);
    Globalize.load(currencyEn);
    Globalize.load(posixEn);

    Globalize.load(numbersAr);
    Globalize.load(calendarAr);
    Globalize.load(timeZonesAr);
    Globalize.load(currencyAr);
    Globalize.load(posixAr);
}
