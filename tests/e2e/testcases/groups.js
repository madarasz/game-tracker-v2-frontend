const puppeteer = require('puppeteer');
const loginDialog = require('../pageobjects/loginDialog');
const groupsPage = require('../pageobjects/groupsPage');
const common = require('../pageobjects/common');
const toolbar = require('../pageobjects/toolbar');
const testvalues = require('../global/testvalues');

describe('Groups', () => {
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

    test('groups with and without login', async () => {
        await page.waitForSelector(groupsPage.selector.groupsCard);
        console.log('Groups card found');
        // check without login
        await page.waitForSelector(groupsPage.selector.loginNeeded);
        console.log('My groups needs login message found');
        await groupsPage.waitForGroupInTable(page, 'public', testvalues.groupPublicA);
        await groupsPage.waitForGroupInTable(page, 'public', testvalues.groupPublicB);
        console.log('Public groups listed');
        await groupsPage.waitForGroupInTable(page, 'private', testvalues.groupPrivateA);
        await groupsPage.waitForGroupInTable(page, 'private', testvalues.groupPrivateB);
        console.log('Private groups listed');
        await loginDialog.loginWithEmailAndPassword(page, testvalues.userEmail, testvalues.userPassword);
        const elementUserName = await page.waitForSelector(toolbar.selector.userName);
        console.log('Logged in with user');
        // check after login
        await groupsPage.waitForGroupInTable(page, 'my', testvalues.groupPublicA);
        await groupsPage.waitForGroupInTable(page, 'my', testvalues.groupPrivateA);
        console.log('My groups listed');
        await groupsPage.waitForGroupInTable(page, 'public', testvalues.groupPublicB);
        await groupsPage.waitForGroupInTable(page, 'private', testvalues.groupPrivateB);
        console.log('Public and private groups listed');
        groupsPage.waitForAdminOnGroup(page, 'my', testvalues.groupPublicA);
        console.log('Settings icon on group where user is admin');
        // check after logging out
        await elementUserName.click();
        const logoutButton = await page.waitForSelector(toolbar.selector.logoutButton);
        await common.delay(100);   // have to wait here a bit
        await logoutButton.click();
        console.log('Clicked Logout');
        await page.waitForSelector(groupsPage.selector.loginNeeded);
        console.log('My groups needs login message found');
        await groupsPage.waitForGroupInTable(page, 'public', testvalues.groupPublicA);
        await groupsPage.waitForGroupInTable(page, 'public', testvalues.groupPublicB);
        console.log('Public groups listed');
        await groupsPage.waitForGroupInTable(page, 'private', testvalues.groupPrivateA);
        await groupsPage.waitForGroupInTable(page, 'private', testvalues.groupPrivateB);
        console.log('Private groups listed');
    }, 12000);

    test('groups selection is perserved', async () => {
        const group = await groupsPage.waitForGroupInTable(page, 'public', testvalues.groupPublicA);
        console.log('Public group is listed');
        await group.click();
        await toolbar.checkSelectedGroup(page, testvalues.groupPublicA, false);
        // page reload
        await page.goto('http://localhost:8080/profile/1/test-user');
        await toolbar.checkSelectedGroup(page, testvalues.groupPublicA, false);
    }, 5000);

});