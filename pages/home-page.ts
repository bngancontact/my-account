import { Page } from '@playwright/test';
import { Constants } from '../utilities/constants';
import { CommonPage } from './common-page';
import { step } from '../utilities/logging';
import { HomeLocators } from '../locators/home-locators';
import { AssertHelper } from '../utilities/assert-helper';

export class HomePage extends HomeLocators {

  commonPage: CommonPage;

  constructor(page: Page) {
    super(page);
    this.commonPage = new CommonPage(page);
  }

  /**
   * Selects a menu item from the main navigation.
   * @param menuName The name of the menu item to select.
   */
  @step('Select Menu')
  async selectMenu(menuName: string): Promise<void> {
  }

  @step('Open Home page')
  async goto(): Promise<void> {
    await this.commonPage.goto(Constants.BASE_URL);
  }

  @step('Open My Account dropdown')
  async openMyAccountDropdown(): Promise<void> {
    await this.commonPage.click(this.myAccountDropdown);
  }

  @step('Navigate to Login page from Home page')
  async goToLoginPage(): Promise<void> {
    await this.goto();
    await this.openMyAccountDropdown();
    await this.commonPage.click(this.myAccountLoginLink);
    await AssertHelper.expectUrl(this.page, /route=account\/login/, 'Login page');
  }
}
