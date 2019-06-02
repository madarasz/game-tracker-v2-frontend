const common = require('./common');
const toolbar = require('./toolbar');

// Clicks Login button and tries to login with email and password
async function loginWithEmailAndPassword(page, email, password) {
    // Click login button
    const loginButton = await page.waitForSelector(toolbar.selector.loginButton);
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
    common.delay(200);
    console.log('Filled out form, submited');
}

async function loginWithUser(page, {email, password, userName}) {
    // Click login button
    const loginButton = await page.waitForSelector(toolbar.selector.loginButton);
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
    await toolbar.checkUserName(page, userName, false);
}

const selector = {
    emailField: 'input[name="field-email"]',
    passwordField: 'input[name="field-password"]',
    loginSubmit: 'button[name="button-submit-login"]',
}

module.exports = {
    loginWithEmailAndPassword, loginWithUser,
    selector
}