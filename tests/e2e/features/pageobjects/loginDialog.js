const toolbar = require('./toolbar');
const common = require('./common');

async function loginWithUser(page, {email, password, userName}) {
    // Click login button
    const loginButton = await page.waitForSelector(toolbar.selector.loginButton);
    await loginButton.click();
    console.log('Clicked login button');
    // Login form, form fields, form submit button are visible
    const submitLogin = await page.waitForSelector(selector.loginSubmit);
    console.log('Login form, form fields, form submit button are visible');
    // // Fill out form, submit
    await common.typeValueIn (page, selector.emailField, email);
    await common.typeValueIn (page, selector.passwordField, password);
    console.log('Filled out form, clicking login');
    return await submitLogin.click();
}

const selector = {
    emailField: 'input[name="field-email"]',
    passwordField: 'input[name="field-password"]',
    loginSubmit: 'button[name="button-submit-login"]',
}

module.exports = {
    loginWithUser,
    selector
}