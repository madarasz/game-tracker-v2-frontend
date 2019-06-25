const common = require('./common');

const selector = {
    gameDetailsCard: 'div[name="card-game-details"]',
    gameTitle: 'div[name="game-title"]',
    gameRating: 'span[name="bgg-rating"]',
    gameDesigner: 'em[name="game-designer"]',
    buttonAddSession: 'button[name="button-add-session"]',
    buttonSaveSession: 'button[name="button-save-session"]',
    buttonUpdateSession: 'button[name="button-update-session"]',
    buttonEditSession: 'button[name="button-edit-session"]',
    buttonDeleteSession: 'button[name="button-delete-session"]',
    cardSessionDetails: 'div[name="card-session-details"]',
    inputPlace: 'input[name="input-place"]',
    inputNotes: 'textarea[name="input-notes"]',
    sessionWithPlace: "//div[@name='table-session']/div/table/tbody/tr/td[contains(.,'",
    valuePlace: 'span[name="value-place"]',
    valueNotes: 'span[name="value-notes"]'
}

async function checkForSessionWithPlace(page, place) {
    return await common.isElementVisible(page, `${selector.sessionWithPlace}${place}')]`, true);
}

async function selectSessionWithPlace(page, place) {
    const session = await page.waitForXPath(`${selector.sessionWithPlace}${place}')]`);
    return await session.click();
}

async function deleteCurrentSession(page) {
    console.log('Deleting session');
    const button = await page.waitForSelector(selector.buttonDeleteSession);
    console.log('Clicking delete');
    await button.click();
    await common.clickConfirm(page);
    return await common.delay(200); // for stability
}

module.exports = {
    selector,
    checkForSessionWithPlace,
    selectSessionWithPlace,
    deleteCurrentSession
}