import { Locator, Page } from '@playwright/test';
import { CommonLocators } from './common-locators';

export class HomeLocators extends CommonLocators {
  myAccountDropdown!: Locator;
  myAccountLoginLink!: Locator;

  constructor(page: Page) {
    super(page);
    this.locatorInitialization();
  }

  locatorInitialization(): void {
    super.locatorInitialization();
    this.myAccountDropdown = this.page
      .locator("a[href*='route=account/account'].dropdown-toggle")
      .first();
    this.myAccountLoginLink = this.page
      .locator("a[href*='route=account/login']:visible")
      .first();
  }
}
