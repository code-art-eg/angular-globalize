import { GlobalizeDatePipe } from './globalize-date.pipe';
import { generatePipeTests } from '../../../test/pipe-test-generator';

generatePipeTests(GlobalizeDatePipe, 'de',
new Date(), 'formatDate', 'full',
{ date: 'short' }, { date: 'full' }, { date: 'long' });
