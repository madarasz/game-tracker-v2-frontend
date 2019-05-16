describe('Login', () => {
    // selectors
    const selectorLoginButton = 'button[name="button-login"]';
    const selectorEmailField = 'input[name="field-email"]';
    const selectorPasswordField = 'input[name="field-password"]';
    const selectorLoginSubmit = 'button[name="button-submit-login"]';
    const selectorUserName = 'button[name="user-name"]';
    const selectorLogoutButton = 'a[name="button-logout"]';
    // test values
    const userEmail = 'e2e@test.com';
    const userPassword = 'pass';
    const userName = 'Test User';

    beforeAll(async () => {
        await page.goto('http://localhost:8080');
    });

    it('can login and logout with user', async () => {
        // Click login button
        const loginButton = await page.waitForSelector(selectorLoginButton, { visible: true });
        await loginButton.click();
        // Login form, form fields, form submit button are visible
        const fieldEmail = await page.waitForSelector(selectorEmailField, { visible: true });
        const fieldPassword = await page.waitForSelector(selectorPasswordField, { visible: true });
        const submitLogin = await page.waitForSelector(selectorLoginSubmit, { visible: true });
        // Fill out form, submit
        await fieldEmail.type(userEmail);
        await fieldPassword.type(userPassword);
        await submitLogin.click();
        // Username is visible
        const elementUserName = await page.waitForSelector(selectorUserName);
        expect(await page.evaluate(element => element.textContent, elementUserName)).toContain(userName);
        // Click Logout
        await elementUserName.click();
        const logoutButton = await page.waitForSelector(selectorLogoutButton, { visible: true });
        await logoutButton.click();
        // Login button is visible
        await page.waitForSelector(selectorLoginButton, { visible: true });
    });
});