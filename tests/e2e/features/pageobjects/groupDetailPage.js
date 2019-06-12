const common = require('./common');
const uploadDialog = require('./uploadDialog');

const selector = {
    groupSettingsCard: 'div[name="card-group-settings"]',
    groupMembersCard: 'div[name="card-members"]',
    groupGamesCard: 'div[name="card-games"]',
    addGameButton: 'button[name="button-add-game"]',
    addGameDialog: 'div[name="dialog-add-game"]',
    inputGameSearch: 'input[name="searchInput"]',
    buttonSubmitAddGame: 'button[name="button-dialog-add"]',
    buttonRemoveGroupImage: 'button[name="button-remove-group-image"]',
    placeholderGroupImage: 'i[name="placeholder-group"]',
    groupImage: 'img[name="image-group"]',
    uploadImageButton: 'button[name="button-upload-image"]',
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
    return await input.type(searchString, {delay: 100}); // delay for stability 
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

async function removeGroupImage(page) {
    const button = await page.waitForSelector(selector.buttonRemoveGroupImage);
    return await button.click();
}

async function uploadImage(page, filePath) {
    console.log('Uploading image');
    const uploadButton = await page.waitForSelector(selector.uploadImageButton);
    await uploadButton.click();
    console.log('Clicked Upload')
    const fileInput = await page.waitForSelector(uploadDialog.selector.fileInput);
    await fileInput.uploadFile(filePath);
    console.log('File selected');
    await common.delay(100);
    const uploadDialogButton = await page.waitForSelector(uploadDialog.selector.uploadButton);
    await uploadDialogButton.click();
    console.log('File uploaded');
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
    uploadImage
}