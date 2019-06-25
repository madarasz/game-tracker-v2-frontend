const { Given, When, Then } = require('cucumber');
const expect = require("expect");
const scope = require('../helpers/scope');
const groupsPage = require('../pageobjects/groupsPage');
const groupDetailPage = require('../pageobjects/groupDetailPage');
const uploadDialog = require('../pageobjects/uploadDialog');
const profilePage = require('../pageobjects/profilePage');
const gamePage = require('../pageobjects/gamePage');
const loginDialog = require('../pageobjects/loginDialog');
const toolbar = require('../pageobjects/toolbar');
const common = require('../pageobjects/common');
const testvalues = require('../../data/testvalues');
const chalk = require('chalk');

/* ----------------
    Navigation
 ------------------*/
When(/^I visit the (.*)$/, async pageName => {
    let pagePath = scope.context.testUrl;
    switch (pageName) {
        case "homepage":
            pagePath = pagePath + "/";
            break;
        default:
            console.log(chalk.red(`!!! PAGE ${pageName} IS NOT DEFINIED !!!`));
    }
    console.log(`Going to ${pageName}: ${pagePath}`);
    return await scope.page.goto(pagePath);
});

When("I go to path {string}", async path => {
    console.log(`Going to path ${path}`);
    return await scope.page.goto(scope.context.testUrl + path);
});

When("I navigate to {string}", async pageName => {
    switch (pageName) {
        case "my profile":
            return profilePage.navigateToProfilePage(scope.page);
        default:
            console.log(chalk.red(`!!! PAGE ${pageName} IS NOT DEFINIED !!!`));
    }
})

/* ----------------
    Login/Logout
 ------------------*/
When("I log in with user {string}", async userName => {
    console.log(`Logging in with user ${userName}`);
    return await loginDialog.loginWithUser(scope.page, testvalues.users[userName]);
});

When("I log in with email {string} and password {string}", async (email, password) => {
    console.log(`Logging in with email "${email}" and password "${password}"`);
    return await loginDialog.loginWithUser(scope.page, {email, password, userName: null});
});

When("I log out", async () => {
    console.log('Logging out');
    return await toolbar.logout(scope.page);
});

Then("I'm logged in with user {string}", async userName => {
    return await toolbar.checkUserName(scope.page, userName, false);
});

/* ----------------
    Group Selector
 ------------------*/
Then("I can see the following groups in group selector:", async table => {
    return new Promise(async (done) => {
        for (let i = 0; i < table.hashes().length; i ++) {
            await groupsPage.waitForGroupInTable(scope.page, table.hashes()[i].category, table.hashes()[i].group);
        }
        done();
    })
});

Then("I can see the admin icon for group {string} in category {string}", async (groupName, category) => {
    return await groupsPage.waitForAdminOnGroup(scope.page, category, groupName);
});

When("I select group {string} in category {string}", async (groupName, category) => {
    const group = await groupsPage.waitForGroupInTable(scope.page, category, groupName);
    console.log(`${groupName} is listed, selecting`);
    await common.delay(300); // stability reasons
    return await group.click();
});

Then("the selected group is {string}", async groupName => {
    return await toolbar.checkSelectedGroup(scope.page, groupName, false);
});

/* ----------------
    Group Details
 ------------------*/

 // Members
Then(/^"(.*)" is (a|an) (.*) of the group$/, async (userName, article, membership) => {
    console.log(`Checking if ${userName} is ${membership}`);
    return await groupDetailPage.checkUserMembership(scope.page, userName, membership);
});

// Games
When("I search for game {string}", async searchString => {
    return await groupDetailPage.searchForGame(scope.page, searchString);
});

Then("{string} is visible in the game search results", async gameName => {
    await common.delay(300); // for stability
    return await groupDetailPage.gameVisibleInSearchResults(scope.page, gameName);
});

When("I select game {string} from the list", async gameName => {
    return await groupDetailPage.selectGameFromList(scope.page, gameName);
});

Given("I delete game {string} if it is listed", async gameName => {
    return new Promise(async (done) => {
        if (await groupDetailPage.isGameVisibleInGameList(scope.page, gameName)) {
            console.log(`Game "${gameName}" is visible in the list, deleting`);
            await groupDetailPage.deleteGameFromGroup(scope.page, gameName);
            done();
        } else {
            console.log(`Game "${gameName}" was not visible in the list`);
            done();
        }
    });
});

Then("{string} is visible in the games of the group", async gameName => {
    console.log(`Looking if game is visible in the game list`);
    return expect(await groupDetailPage.isGameVisibleInGameList(scope.page, gameName)).toBe(true);
});

When ("I select {string} from the game search results", async gameName => {
    console.log(`Selecting game "${gameName}" from search results`)
    return groupDetailPage.selectGameFromSearchResults(scope.page, gameName);
    // await common.delay(200); // for stability
})

// Settings
Given ("group image is removed", async () => {
    return new Promise(async (done) => {
        if (await common.isElementVisible(scope.page, groupDetailPage.selector.placeholderGroupImage)) {
            console.log("Group image was missing");
            done();
        } else {
            console.log("Group image is present, removing");
            await groupDetailPage.removeGroupImage(scope.page);
            done();
        }
    });
});

When("I upload a group image", async () => {
    return await uploadDialog.uploadImage(scope.page, testvalues.imagePath);
});

When("I remove group image", async () => {
    return await groupDetailPage.removeGroupImage(scope.page);
});

When("I edit group settings: public={string}, name={string}", async (isPublic, groupName) => {
    return await groupDetailPage.editGroupSettings(scope.page, isPublic == 'true', groupName);
});

/* ----------------
    Game details
 ------------------*/
 When("I edit session: place {string} and notes {string}", async (place, notes) => {
    await typeValueIn(gamePage.selector.inputPlace, place);
    return await typeValueIn(gamePage.selector.inputNotes, notes);
    // await common.delay(200); // for stability
 });

 Then(/^there is (a|no) session with place "(.*)"$/, async (exists, place) => {
     console.log(`Checking for a session with place "${place}"`);
     const shouldExist = exists == 'a';
     const found =  await gamePage.checkForSessionWithPlace(scope.page, place, shouldExist);
     console.log(found ? 'Session found!' : 'Session not found!');
     return expect(found).toBe(shouldExist);
 });

 When("I select session with place {string}", async place => {
     console.log(`Selecting session with place "${place}"`);
     return await gamePage.selectSessionWithPlace(scope.page, place);
 })

 When("I delete the current session", async () => {
     return await gamePage.deleteCurrentSession(scope.page);
 })

 Given("I delete all sessions with place {string}", async place => {
    return new Promise(async (done) => {
        console.log(`Checking if there is session with place "${place}"`);
        while(await gamePage.checkForSessionWithPlace(scope.page, place)) {
            console.log(`Session with place "${place}" found`);
            await gamePage.selectSessionWithPlace(scope.page, place);
            await gamePage.deleteCurrentSession(scope.page);
        }
        done();
    });
 })

/* ----------------
    Profile
 ------------------*/
Given("profile image is removed", async () => {
    return await profilePage.removeProfileIfSet(scope.page, false);
});

When("I remove my profile picture", async () => {
    return await profilePage.removeProfileIfSet(scope.page, true);
});

When("I upload a profile picture", async () => {
    return await uploadDialog.uploadImage(scope.page, testvalues.imagePath);
});

/* ----------------
    Misc
 ------------------*/
Then(/^"(.*)" (is|are)( not|) visible$/, async (elementName, isAre, negation) => {
    let selector = getSelectorForElement(elementName);
    let visibile = negation != ' not';
    return expect(await common.isElementVisible(scope.page, selector)).toBe(visibile);
});

Then("I click {string}", async elementName => {
    console.log(`Clicking "${elementName}"`);
    const element = await scope.page.waitForSelector(getSelectorForElement(elementName));
    return await element.click();
});

Then("{string} has value {string}", async (elementName, value) => {
    console.log(`Checking if "${elementName}" has value "${value}"`);
    await common.delay(300); // stability reasons
    const target = await scope.page.waitForSelector(getSelectorForElement(elementName));
    return expect(await scope.page.evaluate(element => element.textContent, target)).toEqual(value);
});

async function typeValueIn(selector, value) {
    const input = await scope.page.waitForSelector(selector);
    await input.click({clickCount: 3}); // selecting existing value for deletion
    return await input.type(value);
}

function getSelectorForElement(elementName) {
    switch (elementName.toLowerCase()) {
        case "login button":
            return toolbar.selector.loginButton;
        case "toaster":
            return common.selector.toaster;
        case "profile settings":
            return profilePage.selector.profileSettingsCard;
        case "profile placeholder":
            return profilePage.selector.profilePlaceholder;
        case "profile picture":
            return profilePage.selector.profileImage;
        case "group edit button":
            return groupDetailPage.selector.buttonGroupEdit;
        case "members card":
            return groupDetailPage.selector.groupMembersCard;
        case "games card":
            return groupDetailPage.selector.groupGamesCard;
        case "add game button":
            return groupDetailPage.selector.addGameButton;
        case "add game dialog":
            return groupDetailPage.selector.addGameDialog;
        case "submit add game button":
            return groupDetailPage.selector.buttonSubmitAddGame;
        case "group image placeholder":
            return groupDetailPage.selector.placeholderGroupImage;
        case "group image":
            return groupDetailPage.selector.groupImage;
        case "game details":
            return gamePage.selector.gameDetailsCard;
        case "game title":
            return gamePage.selector.gameTitle;
        case "bgg rating":
            return gamePage.selector.gameRating;
        case "game designer":
            return gamePage.selector.gameDesigner;
        case "boardgame search":
            return groupDetailPage.selector.radioBoardgame;
        case "videogame search":
            return groupDetailPage.selector.radioVideogame;
        case "add session button":
            return gamePage.selector.buttonAddSession;
        case "session details card":
            return gamePage.selector.cardSessionDetails;
        case "save session button":
            return gamePage.selector.buttonSaveSession;
        case "edit session button":
            return gamePage.selector.buttonEditSession;
        case "update session button":
            return gamePage.selector.buttonUpdateSession;
        case "session place value":
            return gamePage.selector.valuePlace;
        case "session notes value":
            return gamePage.selector.valueNotes;
        default:
            console.log(chalk.red(`!!! ELEMENT ${elementName} IS NOT DEFINIED !!!`));
    }
}