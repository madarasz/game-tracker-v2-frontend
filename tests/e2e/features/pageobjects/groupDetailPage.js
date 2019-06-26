const common = require('./common');

const selector = {
    buttonGroupEdit: 'button[name="button-edit-group"]',
    groupMembersCard: 'div[name="card-members"]',
    groupGamesCard: 'div[name="card-games"]',
    addGameButton: 'button[name="button-add-game"]',
    addGameDialog: 'div[name="dialog-add-game"]',
    inputGameSearch: 'input[name="searchInput"]',
    buttonSubmitAddGame: 'button[name="button-dialog-add"]',
    buttonRemoveGroupImage: 'button[name="button-remove-group-image"]',
    placeholderGroupImage: 'i[name="placeholder-group"]',
    groupImage: 'div[name="image-group"]',
    checkboxIsPublic: 'input[name="checkbox-is-public"]',
    inputGroupName: 'input[name="input-group-name"]',
    buttonGroupUpdate: 'button[name="button-update-group"]',
    radioBoardgame: 'input[name="radio-boardgame"]',
    radioVideogame: 'input[name="radio-videogame"]',
    gameInListFragment: "//a[@name='list-group-games']/div/div[@class='v-list__tile__title' and contains(.,'",
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
    return await common.delay(200); // delay for stability 
}

async function gameVisibleInSearchResults(page, gameName) {
    return await page.waitForXPath(`//div[@class='v-list__tile__title' and contains(.,'${gameName}')]`)
}

async function selectGameFromList(page, gameName) {
    console.log(`Selecting game "${gameName}"`);
    const game = await page.waitForXPath(`${selector.gameInListFragment}${gameName}')]`);
    return await game.click();
}

async function isGameVisibleInGameList(page, gameName) {
    return await common.isElementVisible(page, `${selector.gameInListFragment}${gameName}')]`, true);
}

async function deleteGameFromGroup(page, gameName) {
    const button = await page.waitForXPath(`${selector.gameInListFragment}${gameName}')]/../../div/button[@name='button-delete-game']`)
    await button.click();
    return common.clickConfirm(page);
}

async function selectGameFromSearchResults(page, gameName) {
    const game = await gameVisibleInSearchResults(page, gameName);
    await game.click();
}

async function removeGroupImage(page) {
    const button = await page.waitForSelector(selector.buttonRemoveGroupImage);
    return await button.click();
}

async function editGroupSettings(page, isPublic, groupName) {
    console.log(`Editing group name: "${groupName}" public: "${isPublic}"`);
    await common.typeValueIn(page, selector.inputGroupName, groupName);
    const checkbox = await page.waitForSelector(selector.checkboxIsPublic);
    const checked = await (await checkbox.getProperty('checked')).jsonValue();
    if (checked != isPublic) {
        console.log(`Currently group is public: ${checked}, clicking checkbox`);
        await checkbox.click();
    }
    const button =  await page.waitForSelector(selector.buttonGroupUpdate);
    return await button.click();
}

module.exports = {
    selector,
    checkUserMembership,
    searchForGame,
    gameVisibleInSearchResults,
    isGameVisibleInGameList,
    deleteGameFromGroup,
    selectGameFromSearchResults,
    removeGroupImage,
    editGroupSettings,
    selectGameFromList
}