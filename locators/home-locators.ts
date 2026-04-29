import { Locator, Page } from '@playwright/test';
import { CommonLocators } from './common-locators';

export class HomeLocators extends CommonLocators {
  ddlMyAccount!: Locator;
  lnkMyAccountLogin!: Locator;

  constructor(page: Page) {
    super(page);
    this.locatorInitialization();
  }

  locatorInitialization(): void {
    super.locatorInitialization();
    this.ddlMyAccount = this.page
      .locator("a[href*='route=account/account'].dropdown-toggle");
    this.lnkMyAccountLogin = this.page
      .locator("a[href*='route=account/login']:visible");
  }
}
