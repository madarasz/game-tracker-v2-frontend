const puppeteer = require('puppeteer');
const loginDialog = require('../pageobjects/loginDialog');
const profilePage = require('../pageobjects/profilePage');
const common = require('../pageobjects/common');
const uploadDialog = require('../pageobjects/uploadDialog');
const toolbar = require('../pageobjects/toolbar');
const testvalues = require('../global/testvalues');

describe('Profile', () => {
    let page;

    beforeEach(async (done) => {
        browser = await puppeteer.launch();
        console.log('Test starts, opening browser.');
        page = await browser.newPage();
        await page.goto('http://localhost:8080');
        done();
    })
    
    afterEach(async (done) => {
        browser.close();
        done();
    });

    test('can upload and remove profile image', async () => {
        await loginDialog.loginWithEmailAndPassword(page, testvalues.userEmail, testvalues.userPassword);
        const userName = await page.waitForSelector(toolbar.selector.userName);
        await userName.click();
        const menuProfile = await page.waitForSelector(common.selector.profileMenu);
        await common.delay(200);   // have to wait here a bit
        await menuProfile.click();
        await page.waitForSelector(profilePage.selector.profileSettingsCard);
        console.log('Profile page visible')
        await profilePage.removeProfileIfSet(page);
        await page.waitForSelector(common.selector.profilePlaceholder);
        console.log('Profile image placeholder is visible on toolbar');
        const uploadButton = await page.waitForSelector(profilePage.selector.uploadImageButton);
        await uploadButton.click();
        console.log('Clicked Upload')
        const fileInput = await page.waitForSelector(uploadDialog.selector.fileInput);
        await fileInput.uploadFile(testvalues.profileImagePath);
        console.log('File selected');
        const uploadDialogButton = await page.waitForSelector(uploadDialog.selector.uploadButton);
        await uploadDialogButton.click();
        console.log('File uploaded');
        await page.waitForSelector(profilePage.selector.profileImage);
        console.log('Profile image visible on Profile page');
        await page.waitForSelector(common.selector.profileImage);
        console.log('Profile image visible on Toolbar');
        const removeButton = await page.waitForSelector(profilePage.selector.removeImageButton);
        await removeButton.click();
        console.log('Removed profile image');
        await page.waitForSelector(profilePage.selector.profilePlaceholder);
        console.log('Profile placeholder visible on Profile page');
        await page.waitForSelector(common.selector.profilePlaceholder);
        console.log('Profile plaveholder visible on Toolbar');
        console.log('Done!');
    }, 12000);
    
    test('profile settings is not visible for other user', async() => {
        await loginDialog.loginWithEmailAndPassword(page, testvalues.userEmail, testvalues.userPassword);
        await page.goto(`http://localhost:8080/profile/${testvalues.adminId}/test-user-admin`);
        expect(await common.isElementVisible(page, profilePage.selector.profileSettingsCard)).toBe(false);
        console.log('Profile settings is not visible');
        console.log('Done!');
    }, 12000);

    test('profile settings is visible for admin', async() => {
        await loginDialog.loginWithEmailAndPassword(page, testvalues.adminEmail, testvalues.adminPassword);
        await toolbar.checkUserName(page, testvalues.adminName, false);
        await page.goto(`http://localhost:8080/profile/${testvalues.userId}/test-user`);
        console.log('Looking at profile of other user');
        await page.waitForSelector(profilePage.selector.profileSettingsCard);
        console.log('Profile settings is visible for admin');
        console.log('Done!');
    });
});
