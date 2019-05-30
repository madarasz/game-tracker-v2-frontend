const puppeteer = require('puppeteer');
const loginDialog = require('../pageobjects/loginDialog');
const common = require('../pageobjects/common');
const toolbar = require('../pageobjects/toolbar');
const testvalues = require('../global/testvalues');

describe('Login', () => {
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

    test('can login and logout with user', async () => {
        // Login with correct email and password
        await loginDialog.loginWithEmailAndPassword(page, testvalues.userEmail, testvalues.userPassword);
        // Username is visible
        await toolbar.checkUserName(page, testvalues.userName, true);
        // Click Logout
        const logoutButton = await page.waitForSelector(toolbar.selector.logoutButton);
        await common.delay(200);   // have to wait here a bit
        await logoutButton.click();
        console.log('Clicked Logout');
        // Login button is visible
        await page.waitForSelector(toolbar.selector.loginButton);
        console.log('Login button is visible');
        console.log('Done!');
    }, 10000);

    test('can not login with wrong password', async () => {
        // Unsuccessful login with wrong password
        await loginDialog.loginWithEmailAndPassword(page, testvalues.userEmail, testvalues.userPassword + '!!!');
        // Toaster is visible, Login button is still visible
        await page.waitForSelector(toolbar.selector.loginButton);
        console.log('Login button is still visible');
        await page.waitForSelector(common.selector.toaster);
        console.log('Toaster is visible');
        console.log('Done!');
    }, 10000);

    test('login state is perserved', async () => {
        // Login with correct email and password
        await loginDialog.loginWithEmailAndPassword(page, testvalues.userEmail, testvalues.userPassword);
        // Username is visible
        await toolbar.checkUserName(page, testvalues.userName, false);
        // page reload
        await page.goto('http://localhost:8080');
        console.log('Reloaded page');
        // Username is visible
        await toolbar.checkUserName(page, testvalues.userName, false);
    }, 10000);
    
});