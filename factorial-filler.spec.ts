import * as dotenv from 'dotenv';
import { test } from './src/fixture';
import { logSummary } from './src/utils';

dotenv.config({ quiet: true });

const EMAIL = process.env.FACTORIAL_EMAIL || '';
const PASSWORD = process.env.FACTORIAL_PASSWORD || '';
const PROJECT_NAME = process.env.FACTORIAL_PROJECT_NAME;

if (!EMAIL || !PASSWORD) {
  throw new Error('FACTORIAL_EMAIL and FACTORIAL_PASSWORD must be set in .env file');
}

// Optional: Override month/year (defaults to current month/year)
const now = new Date();
const YEAR = process.env.FACTORIAL_YEAR ? parseInt(process.env.FACTORIAL_YEAR) : now.getFullYear();
const MONTH = process.env.FACTORIAL_MONTH ? parseInt(process.env.FACTORIAL_MONTH) : now.getMonth() + 1;

// --- Deficit to fill ---
const HOURS_PER_DAY = 8;
const hoursDeficitText = `-${HOURS_PER_DAY}h`;

// Standard schedule times (can be overridden in .env)
const SHIFT_ONE_START_TIME = process.env.SHIFT_ONE_START_TIME || "09:00";
const SHIFT_ONE_END_TIME = process.env.SHIFT_ONE_END_TIME || "13:00";
const BREAK_START_TIME = process.env.BREAK_START_TIME || "13:00";
const BREAK_END_TIME = process.env.BREAK_END_TIME || "14:00";
const SHIFT_TWO_START_TIME = process.env.SHIFT_TWO_START_TIME || "14:00";
const SHIFT_TWO_END_TIME = process.env.SHIFT_TWO_END_TIME || "18:00";


test('Fill factorial', async ({ page, actions, locators }) => {
  await page.goto(`https://app.factorialhr.com/attendance/clock-in/monthly/${YEAR}/${MONTH}/1`);
  await actions.login(EMAIL, PASSWORD);
  await actions.closeModalIfPresent();
  await actions.waitForAttendanceTable();

  // Find dates with target deficit
  const { targetDeficitDates, otherDeficitDates } = await actions.categorizeDeficits(hoursDeficitText);

  const datesFilled: string[] = [];
  for (const date of targetDeficitDates) {
    const row = locators.getRowByDate(date);

    await actions.fillDayWithStandardSchedule(
      row,
      SHIFT_ONE_START_TIME,
      SHIFT_ONE_END_TIME,
      BREAK_START_TIME,
      BREAK_END_TIME,
      SHIFT_TWO_START_TIME,
      SHIFT_TWO_END_TIME
    );

    if (PROJECT_NAME) {
      await actions.addProjectToShift(row, PROJECT_NAME);
    }
    
    datesFilled.push(date);
  }
  
  logSummary(hoursDeficitText, targetDeficitDates, otherDeficitDates, datesFilled);
});
