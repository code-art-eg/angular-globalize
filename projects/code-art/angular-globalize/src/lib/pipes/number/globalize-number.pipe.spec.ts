import { GlobalizeNumberPipe } from './globalize-number.pipe';
import { generatePipeTests } from '../../../test/pipe-test-generator';

generatePipeTests(GlobalizeNumberPipe, 'de', 1234.56,
  'formatNumber', 'decimal', { style: 'decimal' }, { style: 'decimal' }, { style: 'decimal' });
