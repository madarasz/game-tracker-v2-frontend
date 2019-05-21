
const selector = {
    groupsCard: 'div[name="groups-card"]',
    loginNeeded: 'div[name="my-groups-login"]',
}

async function waitForGroupInTable(page, table, group) {
    await page.waitForXPath("//div[@name='" + table + "-groups-table']/div/table/tbody/tr/td[contains(.,'" + group + "')]");
}

module.exports = {
    selector, waitForGroupInTable
}