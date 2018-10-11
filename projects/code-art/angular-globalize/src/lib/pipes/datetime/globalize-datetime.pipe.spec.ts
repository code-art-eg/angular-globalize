import { generatePipeTests } from '../../../test/pipe-test-generator';
import { GlobalizeDateTimePipe } from './globalize-datetime.pipe';

generatePipeTests(GlobalizeDateTimePipe, 'de',
  new Date(), 'formatDate', 'full', { datetime: 'short' }, { datetime: 'full' }, { datetime: 'long' });
