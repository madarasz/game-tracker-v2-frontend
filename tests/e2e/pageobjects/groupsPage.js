
const selector = {
    groupsCard: 'div[name="groups-card"]',
    loginNeeded: 'div[name="my-groups-login"]',
    groupName: 'button[name="group-name"]',
}

// checks if group is visible on a group table
async function waitForGroupInTable(page, table, group) {
    return await page.waitForXPath(`//div[@name='${table}-groups-table']/div/table/tbody/tr/td[contains(.,'${group}')]`);
}

// checks if group is visible on a group table with settings icon (for group/site admins)
async function waitForAdminOnGroup(page, table, group) {
    return await page.waitForXPath(`//div[@name='${table}-groups-table']/div/table/tbody/tr/td[contains(.,'${group}')]/../td/i[@name='icon-settings']`)
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
    selector, waitForGroupInTable, waitForAdminOnGroup, checkSelectedGroup
}