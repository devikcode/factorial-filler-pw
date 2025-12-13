import { test as base } from '@playwright/test';
import { Actions } from './Actions';
import { Locators } from './locators';

export const test = base.extend<{
  actions: Actions;
  locators: Locators;
}>({
  locators: async ({ page }, use) => {
    await use(new Locators(page));
  },
  actions: async ({ locators }, use) => {
    await use(new Actions(locators));
  },
});

export { expect } from '@playwright/test';
