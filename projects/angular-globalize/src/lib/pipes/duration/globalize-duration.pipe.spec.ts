import { generatePipeTests } from '../../../test/pipe-test-generator';
import { GlobalizeDurationPipe } from './globalize-duration.pipe';

generatePipeTests(GlobalizeDurationPipe, 'de', 0,
  'formatDuration', 'constant', { style: 'short' }, { style: 'constant' }, { style: 'long' });
