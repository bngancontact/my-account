import { Page } from '@playwright/test';
import { ProfileLocators } from '../locators/profile-locators';
import { CommonPage } from './common-page';
import { UserProfile } from '../models/user';
import { Address } from '../models/address';
import { step } from '../utilities/logging';
import { Messages } from '../data/messages.data';
import { AssertHelper } from '../utilities/assert-helper';
import { Assertions } from '../utilities/assertions';

/**
 * Page object for user profile actions in My Account area.
 */
export class ProfilePage extends ProfileLocators {
  commonPage: CommonPage;

  constructor(page: Page) {
    super(page);
    this.commonPage = new CommonPage(page);
  }

  /**
   * Verifies My Account page URL and heading.
   */
  @step('Verify My Account page is displayed')
  async verifyMyAccountPage(): Promise<void> {
    await AssertHelper.expectUrl(this.page, /route=account\/account/, 'My Account');
    await AssertHelper.expectVisible(this.accountHeading, 'My Account heading');
  }
  async verifyRightColumn(): Promise<void> {
    await AssertHelper.expectVisible(this.accountRightColumn, 'right column');
  }
  /**
   * Updates the user's profile information with the provided data.
   * @param profileData - An object containing the user's profile information to be updated.
  */
 @step('Update profile information')
  async updateProfileInformation(profileData: UserProfile): Promise<void> {
  await this.commonPage.fill(this.inputFirstName, profileData.firstName);
  await this.commonPage.fill(this.inputLastName, profileData.lastName);
  await this.commonPage.fill(this.inputUpdateEmail, profileData.email);
  await this.commonPage.fill(this.inputTelephone, profileData.phone);
  await this.commonPage.click(this.btnUpdateAccount);
  }

  /**
   * Verifies that the user's profile information matches the expected data.
   * @param expectedProfileData - An object containing the expected profile information to be verified against the actual values on the page.
   */
  @step('Verify profile information')
  async verifyProfileInformation(expectedProfileData: UserProfile): Promise<void> {
    await AssertHelper.expectInputValue(
      this.inputFirstName,
      expectedProfileData.firstName,
      'firstName',
    );
    await AssertHelper.expectInputValue(
      this.inputLastName,
      expectedProfileData.lastName,
      'lastName',
    );
    await AssertHelper.expectInputValue(
      this.inputUpdateEmail,
      expectedProfileData.email,
      'email',
    );
    await AssertHelper.expectInputValue(
      this.inputTelephone,
      expectedProfileData.phone,
      'phone',
    );
  }

  /**
   * Updates the user's configuration settings with the provided data.
   */
  @step('Update Configuration Settings')
  async updateConfigurationSettings(settingsData: unknown): Promise<void> {
    // TODO: Implement when configuration settings locators/data are ready.
  }

  /**
   * Opens Edit Account page.
   */
  async openEditAccountPage(): Promise<void> {
    await this.commonPage.click(this.btnEditAccount);
  }

  /**
   * Updates first name, last name and phone.
   * @param data - An object containing first name, last name and phone to be updated.
   */
  @step('Update account information')
  async updateAccountInformation(data: UserProfile): Promise<void> {
    await this.commonPage.fill(this.inputFirstName, data.firstName);
    await this.commonPage.fill(this.inputLastName, data.lastName);
    await this.commonPage.fill(this.inputTelephone, data.phone);
    await this.commonPage.click(this.btnUpdateAccount);
  }

  /**
   * Verifies account update success message.
   * @param expectedMessage - The expected success message to be verified.
   */
  @step('Verify account update success message')
  async expectAccountUpdateSuccessMessage(): Promise<void> {
    await AssertHelper.expectVisible(this.alertSuccessUpdate, 'account update success alert');
    await AssertHelper.expectContainsText(
      this.alertSuccessUpdate,
      Messages.ACCOUNT_UPDATE_SUCCESS_MESSAGE,
      'account update success alert',
    );
  }

  /**
   * Reads values from Edit Account form for data persistence validation.
   */
  @step('Get values from Edit Account form')
  async getEditAccountValues(): Promise<Pick<UserProfile, 'firstName' | 'lastName' | 'phone'>> {
    return {
      firstName: await this.inputFirstName.inputValue(),
      lastName: await this.inputLastName.inputValue(),
      phone: await this.inputTelephone.inputValue(),
    };
  }

  /**
   * Verifies Edit Account form values against expected data.
   */
  @step('Verify Edit Account form values')
  async expectEditAccountValues(expectedData: UserProfile): Promise<void> {
    const actualData = await this.getEditAccountValues();

    Assertions.assertEqual(
      actualData.firstName,
      expectedData.firstName,
      'First name is not persisted correctly',
    );
    Assertions.assertEqual(
      actualData.lastName,
      expectedData.lastName,
      'Last name is not persisted correctly',
    );
    Assertions.assertEqual(
      actualData.phone,
      expectedData.phone,
      'Phone is not persisted correctly',
    );
  }

  /**
   * Opens Change Password page from side menu.
   */
  @step('Open Change Password page')
  async openChangePasswordPage(): Promise<void> {
    await this.commonPage.click(this.btnUpdatePassword);
  }

  /**
   * Changes account password.
   */
  @step('Change account password')
  async changePassword(newPassword: string): Promise<void> {
    await this.commonPage.fill(this.inputNewPassword, newPassword);
    await this.commonPage.fill(this.inputNewPasswordConfirm, newPassword);
    await this.commonPage.click(this.btnChangePasswordContinue);
  }

  /**
   * Verifies change password success message.
   */
  @step('Verify change password success message')
  async expectChangePasswordSuccessMessage(): Promise<void> {
    await AssertHelper.expectVisible(this.alertSuccessUpdate, 'change password success alert');
    await AssertHelper.expectContainsText(
      this.alertSuccessUpdate,
      Messages.CHANGE_PASSWORD_SUCCESS_MESSAGE,
      'change password success alert',
    );
  }

  /**
   * Opens Address Book page and then Add Address form.
   */
  @step('Open Add Address form')
  async openAddAddressPage(): Promise<void> {
    await this.commonPage.click(this.btnModifyAddress);
    await this.commonPage.click(this.btnNewAddress);
  }

  /**
   * Adds a new address with provided data.
   *
   * Country and region are generated in user.helper.ts.
   * This page object only uses the provided data and does not generate random data.
   */
  @step('Add new address to Address Book')
  async addNewAddress(data: Address): Promise<void> {
    await this.commonPage.fill(this.inputAddressFirstName, data.firstName);
    await this.commonPage.fill(this.inputAddressLastName, data.lastName);
    await this.commonPage.fill(this.inputAddressCompany, data.company);
    await this.commonPage.fill(this.inputAddressLine1, data.address1);
    await this.commonPage.fill(this.inputAddressLine2, data.address2);
    await this.commonPage.fill(this.inputAddressCity, data.city);
    await this.commonPage.fill(this.inputAddressPostcode, data.postCode);

    await this.selectCountryAndRegion(data.country, data.region);

    await this.getDefaultAddressRadio(data.defaultAddress).check();
    await this.commonPage.click(this.btnAddAddressContinue);
  }

  /**
   * Selects country first, waits for the expected region option, then selects region.
   */
  @step('Select country and region in Address form')
  async selectCountryAndRegion(country: string, region: string): Promise<void> {
    await AssertHelper.expectAttached(
      this.countryOptionByName(country),
      `country option ${country}`,
    );

    await this.selectAddressCountry.selectOption({ label: country });
    await this.selectAddressRegion.waitFor({ state: 'visible' });

    await AssertHelper.expectAttached(
      this.regionOptionByName(region),
      `region option ${region}`,
    );

    await this.selectAddressRegion.selectOption({ label: region });
  }

  /**
   * Verifies Address Book page URL.
   */
  @step('Verify Address Book page is displayed')
  async verifyAddressBookPage(): Promise<void> {
    await AssertHelper.expectUrl(this.page, /route=account\/address/, 'Address Book');
    await AssertHelper.expectVisible(this.btnNewAddress, 'New Address button');
  }

  /**
   * Verifies user lands on account success or My Account right after registration.
   */
  @step('Verify registration result page is displayed')
  async verifyRegistrationResultPage(): Promise<void> {
    await AssertHelper.expectUrl(
      this.page,
      /route=account\/success|route=account\/account/,
      'Registration result',
    );
  }

  /**
   * Clicks Continue when user is on account success page.
   */
  @step('Continue from registration success page')
  async continueFromRegistrationSuccessIfNeeded(): Promise<void> {
    if (this.page.url().includes('route=account/success')) {
      await this.commonPage.click(this.btnContinue);
    }
  }

  /**
   * Verifies add address success message.
   */
  @step('Verify add address success message')
  async expectAddAddressSuccessMessage(): Promise<void> {
    await AssertHelper.expectVisible(this.alertSuccessUpdate, 'add address success alert');
    await AssertHelper.expectContainsText(
      this.alertSuccessUpdate,
      Messages.ADD_ADDRESS_SUCCESS_MESSAGE,
      'add address success alert',
    );
  }

  /**
   * Verifies an added address is listed in Address Book.
   */
  @step('Verify address is present in Address Book')
  async expectAddressPresent(data: Address): Promise<void> {
    await AssertHelper.expectVisible(
      this.page.getByText(data.address1, { exact: false }),
      `address line containing ${data.address1}`,
    );
    await AssertHelper.expectVisible(
      this.page.getByText(data.city, { exact: false }),
      `city containing ${data.city}`,
    );
  }

  /**
   * Verifies account shortcuts and side links required by TC001.
   */
  @step('Verify account shortcuts are visible')
  async expectEditAccountShortcuts(): Promise<void> {
    await AssertHelper.expectVisible(
      this.page.getByRole('link', { name: /Edit your account information/i }),
      'Edit account shortcut',
    );
  }
  @step('Verify change password shortcuts are visible')
  async expectChangePasswordShortcuts(): Promise<void> {
    await AssertHelper.expectVisible(
      this.page.getByRole('link', { name: /Change your password/i }),
      'Change password shortcut',
    );
  }
  @step('Verify modify address shortcuts are visible')
  async expectModifyAddressShortcuts(): Promise<void> {
    await AssertHelper.expectVisible(
      this.page.getByRole('link', {
        name: /Modify your address book entries/i,
      }),
      'Modify address shortcut',
    );

    await AssertHelper.expectVisible(this.accountRightColumn, 'right column');
  }

  /**
   * Verifies Edit Account form fields are visible.
   */
  @step('Verify Edit Account form fields are visible')
  async expectEditAccountUpdate(): Promise<void> {
    await AssertHelper.expectVisible(this.inputFirstName, 'First Name input');
    await AssertHelper.expectVisible(this.inputLastName, 'Last Name input');
    await AssertHelper.expectVisible(this.inputTelephone, 'Telephone input');
    await AssertHelper.expectVisible(this.inputUpdateEmail, 'Email input');
  }

  /**
   * Clicks Logout from My Account page.
   */
  async logout(): Promise<void> {
    await this.btnLogout.click();
  }

  /**
   * Verifies Logout confirmation page URL and message.
   */
  async verifyLogoutPage(): Promise<void> {
    await AssertHelper.expectUrl(this.page, /route=account\/logout/, 'Logout');
    await this.expectLogoutSuccessMessage();
    await AssertHelper.expectVisible(this.btnLogoutContinue, 'Logout continue button');
  }

  /**
   * Verifies logout success confirmation message.
   */
  async expectLogoutSuccessMessage(): Promise<void> {
    await AssertHelper.expectVisible(
      this.page.getByText(Messages.LOGOUT_CONFIRM_MESSAGE, { exact: false }),
      'Logout confirmation message',
    );
  }

  /**
   * Clicks Continue button after logout.
   */
  async continueAfterLogout(): Promise<void> {
    await AssertHelper.expectVisible(this.btnLogoutContinue, 'Logout continue button');
    await this.commonPage.click(this.btnLogoutContinue);
  }

  /**
   * Verifies user is redirected after logout.
   */
  @step('Verify user is redirected after logout')
  async verifyLogoutRedirectPage(): Promise<void> {
    await AssertHelper.expectUrl(this.page, /route=common\/home/, 'Logout redirect');
  }
}
