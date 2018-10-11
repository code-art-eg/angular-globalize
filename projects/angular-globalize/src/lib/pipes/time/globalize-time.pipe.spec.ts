import { GlobalizeTimePipe } from './globalize-time.pipe';
import { generatePipeTests } from '../../../test/pipe-test-generator';

generatePipeTests(GlobalizeTimePipe, 'de',
  new Date(), 'formatDate',
  'full', { time: 'short' }, { time: 'full' }, { time: 'long' });
