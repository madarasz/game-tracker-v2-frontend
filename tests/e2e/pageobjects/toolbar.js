const selector = {
    loginButton: 'button[name="button-login"]',
    userName: 'button[name="user-name"]',
    groupName: 'button[name="group-name"]',
    logoutButton: 'a[name="menu-logout"]',
}

// Checks if userName is correct (+clicks if needed)
async function checkUserName(page, userName, wantClick) {
    const elementUserName = await page.waitForSelector(selector.userName);
    expect(await page.evaluate(element => element.textContent, elementUserName)).toContain(userName);
    console.log(`Username "${userName}" is visible`);
    // click on user menu
    if (wantClick) {
        await elementUserName.click();
        console.log('Clicked user name');
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

module.exports = {
    selector,
    checkUserName,
    checkSelectedGroup
}