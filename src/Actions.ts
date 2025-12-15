import { Locator } from "@playwright/test";
import { Locators } from "./locators";
import { extractDateFromRow } from "./utils";

type ShiftType = 'Work' | 'Break';

export type DeficitResult = {
    targetDeficitDates: string[];
    otherDeficitDates: Array<{ date: string; deficit: string }>;
};

export class Actions {
    constructor(private locators: Locators) {}

    async login(email: string, password: string): Promise<void> {
        await this.locators.emailInput.fill(email);
        await this.locators.passwordInput.fill(password);
        await this.locators.submitButton.click();
    }

    async closeModalIfPresent(): Promise<void> {
        await this.locators.modal.waitFor({ state: 'visible' });

        if (await this.locators.modal.isVisible()) {
            await this.locators.modalCloseButton.click({ force: true });
        }
    }

    async waitForAttendanceTable(): Promise<void> {
        await this.locators.attendanceTable.waitFor({ state: 'visible' });
    }

    /**
     * Scans all rows to find dates with the target deficit.
     * Returns structured data about target and other deficits found.
     */
    async categorizeDeficits(targetDeficit: string): Promise<DeficitResult> {
        const allRows = await this.locators.getAllRows();
        const deficitRegex = /-\d+h/;
        const targetDeficitDates: string[] = [];
        const otherDeficitDates: Array<{ date: string; deficit: string }> = [];
        
        for (const row of allRows) {
            const text = await row.textContent();
            const deficitMatch = text?.match(deficitRegex);
            
            if (deficitMatch && text) {
                const deficit = deficitMatch[0];
                const date = await extractDateFromRow(row);
                
                if (text.includes(targetDeficit)) {
                    targetDeficitDates.push(date);
                } else {
                    otherDeficitDates.push({ date, deficit });
                }
            }
        }
        
        return { targetDeficitDates, otherDeficitDates };
    }

    async addShiftToRow(expandedRow: Locator, shiftType: ShiftType, startTime: string, endTime: string): Promise<void> {
        // Click Add button in the expanded row
        const addButton = this.locators.getAddShiftButton(expandedRow);
        await addButton.scrollIntoViewIfNeeded();
        await addButton.click();

        // Wait for dialog
        const dialog = this.locators.shiftDialog;

        // Select shift type (Work or Break)
        const shiftButton = this.locators.getShiftTypeButton(dialog, shiftType);
        await shiftButton.click();
        await this.locators.page.waitForTimeout(500);

        // Fill start and end times
        const startTimeInput = this.locators.getStartTimeInput(dialog);
        const endTimeInput = this.locators.getEndTimeInput(dialog);
        await startTimeInput.fill(startTime);
        await this.locators.page.waitForTimeout(500);
        await endTimeInput.fill(endTime);
        await this.locators.page.waitForTimeout(500);

        // Apply changes and wait for dialog to close
        const applyButton = this.locators.getApplyButton(dialog);
        await applyButton.click();
        await this.locators.page.waitForTimeout(500);
    }

    async fillDayWithStandardSchedule(
        row: Locator,
        shiftOneStart: string,
        shiftOneEnd: string,
        breakStart: string,
        breakEnd: string,
        shiftTwoStart: string,
        shiftTwoEnd: string
    ): Promise<void> {
        // Expand the row to reveal shift controls
        const expandRowButton = this.locators.getRowToggleButton(row);
        await expandRowButton.click();
        await this.locators.page.waitForTimeout(500);

        // Get the expanded row (appears as sibling after main row)
        const expandedRow = this.locators.getExpandedRow(row);

        // Add shifts in sequence: work -> break -> work
        await this.addShiftToRow(expandedRow, 'Work', shiftOneStart, shiftOneEnd);
        await this.locators.page.waitForTimeout(500);

        await this.addShiftToRow(expandedRow, 'Break', breakStart, breakEnd);
        await this.locators.page.waitForTimeout(500);

        await this.addShiftToRow(expandedRow, 'Work', shiftTwoStart, shiftTwoEnd);
        await this.locators.page.waitForTimeout(500);
    }

    async addProjectToShift(expandedRow: Locator, projectName: string): Promise<void> {
        // Open options menu for the shift
        const optionsButton = this.locators.getOptionsButton(expandedRow);
        await optionsButton.scrollIntoViewIfNeeded();
        await optionsButton.click();
        await this.locators.page.waitForTimeout(500);

        // Navigate to project assignment
        await this.locators.addEditProjectsMenuItem.click();

        // Wait for project panel to load
        await this.locators.projectPanel.waitFor({ state: 'visible', timeout: 5000 });

        // Assign project to all dropdowns (one per shift)
        const projectDropdowns = await this.locators.projectDropdown.all();

        for (const dropdown of projectDropdowns) {
            await dropdown.scrollIntoViewIfNeeded();
            await dropdown.click();
            await this.locators.page.waitForTimeout(500);
            
            // Select project from list
            await this.locators.projectList.getByText(projectName, { exact: true }).click();
            await this.locators.page.waitForTimeout(500);
        }
        
        // Save changes and wait for panel to close
        await this.locators.editProjectsButton.click();
        await this.locators.projectPanel.waitFor({ state: 'hidden', timeout: 5000 });
    }
}
