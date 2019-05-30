const puppeteer = require('puppeteer');
const loginPage = require('../pageobjects/loginPage');
const groupsPage = require('../pageobjects/groupsPage');
const common = require('../pageobjects/common');

describe('Groups', () => {

    // test values
    const userEmail = 'e2e@test.com';
    const userPassword = 'pass';
    const groupPublicA = 'Public Group A';
    const groupPublicB = 'Public Group B';
    const groupPrivateA = 'Private Group A';
    const groupPrivateB = 'Private Group B';

    let page;

    beforeEach(async (done) => {
        browser = await puppeteer.launch();
        console.log('Test starts, opening browser.');
        page = await browser.newPage();
        await page.goto('http://localhost:8080');
        done();
    })

    test('groups with and without login', async () => {
        await page.waitForSelector(groupsPage.selector.groupsCard);
        console.log('Groups card found');
        // check without login
        await page.waitForSelector(groupsPage.selector.loginNeeded);
        console.log('My groups needs login message found');
        await groupsPage.waitForGroupInTable(page, 'public', groupPublicA);
        await groupsPage.waitForGroupInTable(page, 'public', groupPublicB);
        console.log('Public groups listed');
        await groupsPage.waitForGroupInTable(page, 'private', groupPrivateA);
        await groupsPage.waitForGroupInTable(page, 'private', groupPrivateB);
        console.log('Private groups listed');
        await loginPage.loginWithEmailAndPassword(page, userEmail, userPassword);
        const elementUserName = await page.waitForSelector(loginPage.selector.userName);
        console.log('Logged in with user');
        // check after login
        await groupsPage.waitForGroupInTable(page, 'my', groupPublicA);
        await groupsPage.waitForGroupInTable(page, 'my', groupPrivateA);
        console.log('My groups listed');
        await groupsPage.waitForGroupInTable(page, 'public', groupPublicB);
        await groupsPage.waitForGroupInTable(page, 'private', groupPrivateB);
        console.log('Public and private groups listed');
        groupsPage.waitForAdminOnGroup(page, 'my', groupPublicA);
        console.log('Settings icon on group where user is admin');
        // check after logging out
        await elementUserName.click();
        const logoutButton = await page.waitForSelector(loginPage.selector.logoutButton);
        await common.delay(100);   // have to wait here a bit
        await logoutButton.click();
        console.log('Clicked Logout');
        await page.waitForSelector(groupsPage.selector.loginNeeded);
        console.log('My groups needs login message found');
        await groupsPage.waitForGroupInTable(page, 'public', groupPublicA);
        await groupsPage.waitForGroupInTable(page, 'public', groupPublicB);
        console.log('Public groups listed');
        await groupsPage.waitForGroupInTable(page, 'private', groupPrivateA);
        await groupsPage.waitForGroupInTable(page, 'private', groupPrivateB);
        console.log('Private groups listed');
    }, 12000);

    test('groups selection is perserved', async () => {
        const group = await groupsPage.waitForGroupInTable(page, 'public', groupPublicA);
        console.log('Public team is listed');
        await group.click();
        await groupsPage.checkSelectedGroup(page, groupPublicA, false);
        // page reload
        await page.goto('http://localhost:8080/profile/1/test-user');
        await groupsPage.checkSelectedGroup(page, groupPublicA, false);
    }, 5000);

});