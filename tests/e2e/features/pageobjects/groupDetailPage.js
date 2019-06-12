const common = require('./common');

const selector = {
    groupSettingsCard: 'div[name="card-group-settings"]',
    groupMembersCard: 'div[name="card-members"]',
    groupGamesCard: 'div[name="card-games"]',
    addGameButton: 'button[name="button-add-game"]',
    addGameDialog: 'div[name="dialog-add-game"]',
    inputGameSearch: 'input[name="searchInput"]',
    buttonSubmitAddGame: 'button[name="button-dialog-add"]'
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

async function searchForGame(page, searchString) {
    const input = await page.waitForSelector(selector.inputGameSearch);
    await input.type(searchString);
}

async function gameVisibleInSearchResults(page, gameName) {
    return await page.waitForXPath(`//div[@class='v-list__tile__title' and contains(.,'${gameName}')]`)
}

async function isGameVisibleInGameList(page, gameName) {
    return await common.isElementVisible(page, `//div[@name='list-group-games']/div/div[@class='v-list__tile__title' and contains(.,'${gameName}')]`, true);
}

async function deleteGameFromGroup(page, gameName) {
    const button = await page.waitForXPath(`//div[@name='list-group-games']/div/div[@class='v-list__tile__title' and contains(.,'${gameName}')]/../../div/button[@name='button-delete-game']`)
    return await button.click();
}

async function selectGameFromSearchResults(page, gameName) {
    const game = await gameVisibleInSearchResults(page, gameName);
    await game.click();
}

module.exports = {
    selector,
    checkUserMembership,
    searchForGame,
    gameVisibleInSearchResults,
    isGameVisibleInGameList,
    deleteGameFromGroup,
    selectGameFromSearchResults
}