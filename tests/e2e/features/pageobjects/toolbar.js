const expect = require("expect");
const common = require('./common');

const selector = {
    loginButton: 'button[name="button-login"]',
    userName: 'button[name="user-name"]',
    groupName: 'button[name="group-name"]',
    logoutButton: 'a[name="menu-logout"]',
}

// Checks if user is logged in, userName is correct (+clicks if needed)
async function checkUserName(page, userName, wantClick) {
    console.log('Checking if user is logged in');
    const elementUserName = await page.waitForSelector(selector.userName);
    console.log('User is logged in');
    // if userName is provided checks it
    if (userName != null) {
        console.log('Cheking username');
        expect(await page.evaluate(element => element.textContent, elementUserName)).toContain(userName);
        console.log(`Username "${userName}" is visible`);
        // click on user menu
        if (wantClick) {
            await elementUserName.click();
            console.log('Clicked user name');
        }
    } 
}

// Checks if selected group name is correct (+clicks if needed)
async function checkSelectedGroup(page, groupName, wantClick) {
    const elementGroupName = await page.waitForSelector(selector.groupName);
    expect(await page.evaluate(element => element.textContent, elementGroupName)).toContain(groupName);
    console.log(`Group "${groupName}" is selected`);
    // click on user menu
    if (wantClick) {
        await elementGroupName.click();
        console.log('Clicked group menu on toolbar');
    }
}

async function logout(page) {
    const elementUserName = await page.waitForSelector(selector.userName, {visible: true});
    await elementUserName.click();
    await common.delay(200); // TODO: try to do this without delay
    const button = await page.waitForSelector(selector.logoutButton, {visible: true});
    await button.click();
    return await page.waitForSelector(selector.loginButton);
}

module.exports = {
    selector,
    checkUserName,
    checkSelectedGroup,
    logout
}