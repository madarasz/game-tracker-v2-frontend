
const selector = {
    groupsCard: 'div[name="groups-card"]',
    loginNeeded: 'div[name="my-groups-login"]',
}

// checks if group is visible on a group table
async function waitForGroupInTable(page, table, group) {
    return await page.waitForXPath(`//div[@name='${table}-groups-table']/div/table/tbody/tr/td[contains(.,'${group}')]`);
}

// checks if group is visible on a group table with settings icon (for group/site admins)
async function waitForAdminOnGroup(page, table, group) {
    return await page.waitForXPath(`//div[@name='${table}-groups-table']/div/table/tbody/tr/td[contains(.,'${group}')]/../td/i[@name='icon-settings']`)
}

module.exports = {
    selector, waitForGroupInTable, waitForAdminOnGroup
}