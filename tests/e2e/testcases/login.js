const loginPage = require('../pageobjects/loginPage');

describe('Login', () => {

    // selectors
    const selectorToaster = 'div[name="toaster"]';
    // test values
    const userEmail = 'e2e@test.com';
    const userPassword = 'pass';
    const userName = 'Test User';

    let page;

    beforeEach(async (done) => {
        console.log('Test starts, opening browser.');
        page = await browser.newPage();
        await page.goto('http://localhost:8080');
        done();
    })

    test('can login and logout with user', async () => {
        // Login with correct email and password
        loginPage.loginWithEmailAndPassword(page, userEmail, userPassword);
        // Username is visible
        loginPage.checkUserName(page, userName, true);
        // Click Logout
        const logoutButton = await page.waitForSelector(loginPage.selector.logoutButton);
        await loginPage.delay(200);   // have to wait here a bit
        await logoutButton.click();
        console.log('Clicked Logout');
        // Login button is visible
        await page.waitForSelector(loginPage.selector.loginButton);
        console.log('Login button is visible');
        console.log('Done!');
    }, 5000);

    test('can not login with wrong password', async () => {
        // Unsuccessful login with wrong password
        loginPage.loginWithEmailAndPassword(page, userEmail, userPassword + '!!!');
        // Toaster is visible, Login button is still visible
        await page.waitForSelector(loginPage.selector.loginButton);
        console.log('Login button is still visible');
        await page.waitForSelector(selectorToaster);
        console.log('Toaster is visible');
        console.log('Done!');
    }, 5000);

    test('login state is perserved', async () => {
        // Login with correct email and password
        loginPage.loginWithEmailAndPassword(page, userEmail, userPassword);
        // Username is visible
        loginPage.checkUserName(page, userName, false);
        // page reload
        await page.goto('http://localhost:8080');
        console.log('Reloaded page');
        // Username is visible
        elementUserName = await page.waitForSelector(loginPage.selector.userName);
        expect(await page.evaluate(element => element.textContent, elementUserName)).toContain(userName);
        console.log('Username is visible');
    }, 5000);
    
});