import { expect, Locator, Page } from '@playwright/test';
import { step } from './logging';

/**
 * UI assertion helper for Playwright locators.
 * Keep this class focused on Locator/UI-level assertions.
 */
export class AssertHelper {
  @step('Assert page URL')
  static async expectUrl(
    page: Page,
    expected: string | RegExp,
    pageName?: string,
  ): Promise<void> {
    const message = pageName
      ? `Expected ${pageName} URL to match '${expected.toString()}'`
      : undefined;
    await expect(page, message).toHaveURL(expected);
  }

  @step('Assert locator visible')
  static async expectVisible(locator: Locator, locatorName?: string): Promise<void> {
    const message = locatorName
      ? `Expected ${locatorName} to be visible`
      : undefined;
    await expect(locator, message).toBeVisible();
  }

  @step('Assert locator attached')
  static async expectAttached(locator: Locator, locatorName?: string): Promise<void> {
    const message = locatorName
      ? `Expected ${locatorName} to be attached`
      : undefined;
    await expect(locator, message).toBeAttached();
  }

  @step('Assert locator contains text')
  static async expectContainsText(
    locator: Locator,
    expected: string | RegExp,
    locatorName?: string,
  ): Promise<void> {
    const message = locatorName
      ? `Expected ${locatorName} to contain '${expected.toString()}'`
      : undefined;
    await expect(locator, message).toContainText(expected);
  }

  @step('Assert input value')
  static async expectInputValue(
    locator: Locator,
    expected: string,
    fieldName?: string,
  ): Promise<void> {
    const message = fieldName
      ? `Expected ${fieldName} input value to be '${expected}'`
      : undefined;
    await expect(locator, message).toHaveValue(expected);
  }
}
