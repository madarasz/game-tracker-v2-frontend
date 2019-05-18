describe('Login', () => {

    // selectors
    const selectorLoginButton = 'button[name="button-login"]';
    const selectorEmailField = 'input[name="field-email"]';
    const selectorPasswordField = 'input[name="field-password"]';
    const selectorLoginSubmit = 'button[name="button-submit-login"]';
    const selectorUserName = 'button[name="user-name"]';
    const selectorLogoutButton = 'a[name="button-logout"]';
    const selectorToaster = 'div[name="toaster"]';
    // test values
    const userEmail = 'e2e@test.com';
    const userPassword = 'pass';
    const userName = 'Test User';

    let page;

    function delay(time) {
        return new Promise(function(resolve) { 
            setTimeout(resolve, time)
        });
     }

    beforeEach(async (done) => {
        console.log('Test starts, opening browser.');
        page = await browser.newPage();
        await page.goto('http://localhost:8080');
        done();
    })

    test('can login and logout with user', async () => {
        // Click login button
        const loginButton = await page.waitForSelector(selectorLoginButton);
        await loginButton.click();
        console.log('Clicked login button');
        // Login form, form fields, form submit button are visible
        const fieldEmail = await page.waitForSelector(selectorEmailField);
        const fieldPassword = await page.waitForSelector(selectorPasswordField);
        const submitLogin = await page.waitForSelector(selectorLoginSubmit);
        console.log('Login form, form fields, form submit button are visible');
        // // Fill out form, submit
        await fieldEmail.type(userEmail);
        await fieldPassword.type(userPassword);
        await submitLogin.click();
        console.log('Filled out form, submited');
        // // Username is visible
        const elementUserName = await page.waitForSelector(selectorUserName);
        expect(await page.evaluate(element => element.textContent, elementUserName)).toContain(userName);
        console.log('Username is visible');
        // // Click Logout
        await elementUserName.click();
        const logoutButton = await page.waitForSelector(selectorLogoutButton);
        await delay(100);
        await logoutButton.click();
        console.log('Clicked Logout');
        // // Login button is visible
        await page.waitForSelector(selectorLoginButton);
        console.log('Login button is visible');
        console.log('Done!');
        // done();
    }, 5000);

    test('can not login with wrong password', async () => {
        // Click login button
        const loginButton = await page.waitForSelector(selectorLoginButton);
        await loginButton.click();
        console.log('Clicked login button');
        // Login form, form fields, form submit button are visible
        const fieldEmail = await page.waitForSelector(selectorEmailField);
        const fieldPassword = await page.waitForSelector(selectorPasswordField);
        const submitLogin = await page.waitForSelector(selectorLoginSubmit);
        console.log('Login form, form fields, form submit button are visible');
        // Fill out form, submit
        await fieldEmail.type(userEmail);
        await fieldPassword.type(userPassword+ '!!!'); // wrong password
        await submitLogin.click();
        console.log('Fill out form, submited');
        // Toaster is visible, Login button is still visible
        await page.waitForSelector(selectorLoginButton);
        console.log('Login button is still visible');
        await page.waitForSelector(selectorToaster);
        console.log('Toaster is visible');
        console.log('Done!');
    }, 5000);
    
});