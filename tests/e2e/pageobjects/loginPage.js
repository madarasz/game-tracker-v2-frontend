// Clicks Login button and tries to login with email and password
async function loginWithEmailAndPassword(page, email, password) {
    // Click login button
    const loginButton = await page.waitForSelector(selector.loginButton);
    await loginButton.click();
    console.log('Clicked login button');
    // Login form, form fields, form submit button are visible
    const fieldEmail = await page.waitForSelector(selector.emailField);
    const fieldPassword = await page.waitForSelector(selector.passwordField);
    const submitLogin = await page.waitForSelector(selector.loginSubmit);
    console.log('Login form, form fields, form submit button are visible');
    // // Fill out form, submit
    await fieldEmail.type(email);
    await fieldPassword.type(password);
    await submitLogin.click();
    console.log('Filled out form, submited');
}

const selector = {
    loginButton: 'button[name="button-login"]',
    emailField: 'input[name="field-email"]',
    passwordField: 'input[name="field-password"]',
    loginSubmit: 'button[name="button-submit-login"]',
    userName: 'button[name="user-name"]',
    logoutButton: 'a[name="button-logout"]',
}

module.exports = {
    loginWithEmailAndPassword,
    selector
}