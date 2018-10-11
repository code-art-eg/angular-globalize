import { generatePipeTests } from '../../../test/pipe-test-generator';
import { GlobalizeDayPipe } from './globalize-day.pipe';

generatePipeTests(GlobalizeDayPipe, 'de', 0, 'getDayName', 'wide', 'wide', 'wide', 'wide');
