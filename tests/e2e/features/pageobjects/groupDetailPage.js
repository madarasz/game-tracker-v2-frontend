
const selector = {
    groupSettingsCard: 'div[name="card-group-settings"]',
    groupMembersCard: 'div[name="card-members"]',
    groupGamesCard: 'div[name="card-games"]',
}

async function checkUserMembership(page, userName, membershipType) {
    let selector = `//div[@class='v-list__tile__title' and contains(.,'${userName}')]`;
    if (membershipType == 'group admin member') {
        return await page.waitForXPath(`${selector}/../div/em[@name='membership-group-admin']`);
    }
    if (membershipType == 'admin member') {
        return await page.waitForXPath(`${selector}/../div/em[@name='membership-admin']`);
    }
    return await page.waitForXPath(selector);
}

module.exports = {
    selector,
    checkUserMembership
}