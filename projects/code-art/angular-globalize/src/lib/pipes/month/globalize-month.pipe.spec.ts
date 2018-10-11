import { GlobalizeMonthPipe } from './globalize-month.pipe';
import { generatePipeTests } from '../../../test/pipe-test-generator';

generatePipeTests(GlobalizeMonthPipe, 'de', 0, 'getMonthName', 'wide', 'wide', 'wide', 'wide');
