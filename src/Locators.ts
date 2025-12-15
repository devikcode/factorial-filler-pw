import type { Locator, Page } from '@playwright/test';

export class Locators {
  page: Page;
  
  // Login
  emailInput: Locator;
  passwordInput: Locator;
  submitButton: Locator;
  
  // Modal
  modal: Locator;
  modalCloseButton: Locator;
  
  // Attendance table
  attendanceTable: Locator;
  
  // Project management
  addEditProjectsMenuItem: Locator;
  projectPanel: Locator;
  projectDropdown: Locator;
  editProjectsButton: Locator;
  
  // Context-dependent locators
  getAllRows: () => Promise<Locator[]>;
  getRowByDate: (date: string) => Locator;
  getExpandedRow: (row: Locator) => Locator;
  getRowToggleButton: (row: Locator) => Locator;
  getAddShiftButton: (expandedRow: Locator) => Locator;
  getOptionsButton: (expandedRow: Locator) => Locator;
  shiftDialog: Locator;
  getShiftTypeButton: (dialog: Locator, shiftType: string) => Locator;
  getStartTimeInput: (dialog: Locator) => Locator;
  getEndTimeInput: (dialog: Locator) => Locator;
  getApplyButton: (dialog: Locator) => Locator;
  projectList: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Login
    this.emailInput = this.page.locator('#user_email');
    this.passwordInput = this.page.locator('#user_password');
    this.submitButton = this.page.locator('input[type="submit"]');
    
    // Modal
    this.modal = this.page.locator('[aria-modal="true"]');
    this.modalCloseButton = this.page.locator('button[aria-label="Close"]');
    
    // Attendance table
    this.attendanceTable = this.page.locator('table.hackSafari');
    
    // Project management
    this.addEditProjectsMenuItem = this.page.getByRole('menuitem', { name: /Add\/Edit projects/i });
    this.projectPanel = this.page.getByLabel('Project tracking');
    this.projectDropdown = this.page.getByRole('textbox', { name: /Select a project/i });
    this.editProjectsButton = this.page.getByRole('button', { name: 'Edit projects' });
    
    // Context-dependent locators
    this.getAllRows = () => this.page.locator('tr').all();
    this.getRowByDate = (date: string) => this.page.locator('tr').filter({ hasText: date }).first();
    this.getExpandedRow = (row: Locator) => row.locator('xpath=following-sibling::tr[1]');
    this.getRowToggleButton = (row: Locator) => row.locator('button[data-intercom-target="attendance-row-toggle"]');
    this.getAddShiftButton = (expandedRow: Locator) => expandedRow.locator('button[data-intercom-target="attendance-row-add-shift-button"]');
    this.getOptionsButton = (expandedRow: Locator) => expandedRow.locator('button[data-intercom-target="attendance-row-options-button"]');
    this.shiftDialog = this.page.locator('[role="dialog"]').last();
    this.getShiftTypeButton = (dialog: Locator, shiftType: string) => dialog.locator('button').filter({ hasText: shiftType });
    this.getStartTimeInput = (dialog: Locator) => dialog.locator('input[type="text"]').first();
    this.getEndTimeInput = (dialog: Locator) => dialog.locator('input[type="text"]').nth(1);
    this.getApplyButton = (dialog: Locator) => dialog.locator('button').filter({ hasText: 'Apply' });
    this.projectList = this.page.locator('ul').filter({ has: this.page.locator('input[role="searchbox"]') });
  }
}
