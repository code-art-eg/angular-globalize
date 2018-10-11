import { GlobalizeCurrencyPipe } from './globalize-currency.pipe';
import { generatePipeTests } from '../../../test/pipe-test-generator';


generatePipeTests(GlobalizeCurrencyPipe, 'de', 1234.56,
'formatCurrency', 'symbol', { style: 'symbol' },
{ style: 'symbol' }, { style: 'symbol' }, 'EUR');
