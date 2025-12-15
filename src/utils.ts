import { Locator } from "@playwright/test";

export const extractDateFromRow = async (row: Locator): Promise<string> => {
    const dateText = await row.locator('td').first().textContent();
    if (dateText) {
        // Extract just the date part (e.g., "10 Dec")
        const match = dateText.match(/(\d+ \w+)/);
        if (match) {
            return match[1];
        }
    }
    throw new Error('Date not found in row');
};

/**
 * Logs a comprehensive summary of the operation.
 */
export const logSummary = (
    targetDeficit: string,
    deficitsInTargetDates: string[],
    otherDeficitDates: Array<{ date: string; deficit: string }>,
    datesFilled: string[]
): void => {
    // Warn about other deficits found
    if (otherDeficitDates.length > 0) {
        otherDeficitDates.forEach(({ date, deficit }) => {
            console.warn(`⚠️ Found ${date} with ${deficit} deficit - verify manually`);
        });
    }
    
    // Summary of target deficit
    if (deficitsInTargetDates.length === 0) {
        console.log(`ℹ️ No days with ${targetDeficit} deficit found. Nothing to fill.`);
    } else {
        console.log(`🤖 My job here is done!🦾 \nℹ️ Successfully filled ${datesFilled.length} day/s: ${datesFilled.join(', ')}`);
    }
};