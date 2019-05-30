const puppeteer = require('puppeteer');
const loginDialog = require('../pageobjects/loginDialog');
const common = require('../pageobjects/common');
const toolbar = require('../pageobjects/toolbar');

describe('Login', () => {

    // test values
    const userEmail = 'e2e@test.com';
    const userPassword = 'pass';
    const userName = 'Test User';

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
        await loginDialog.loginWithEmailAndPassword(page, userEmail, userPassword);
        // Username is visible
        await toolbar.checkUserName(page, userName, true);
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
        await loginDialog.loginWithEmailAndPassword(page, userEmail, userPassword + '!!!');
        // Toaster is visible, Login button is still visible
        await page.waitForSelector(toolbar.selector.loginButton);
        console.log('Login button is still visible');
        await page.waitForSelector(common.selector.toaster);
        console.log('Toaster is visible');
        console.log('Done!');
    }, 10000);

    test('login state is perserved', async () => {
        // Login with correct email and password
        await loginDialog.loginWithEmailAndPassword(page, userEmail, userPassword);
        // Username is visible
        await toolbar.checkUserName(page, userName, false);
        // page reload
        await page.goto('http://localhost:8080');
        console.log('Reloaded page');
        // Username is visible
        await toolbar.checkUserName(page, userName, false);
    }, 10000);
    
});