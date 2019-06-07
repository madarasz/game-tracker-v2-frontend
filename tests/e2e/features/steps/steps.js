const { Given, When, Then } = require('cucumber');
const expect = require("expect");
const scope = require('../helpers/scope');
const groupsPage = require('../pageobjects/groupsPage');
const groupDetailPage = require('../pageobjects/groupDetailPage');
const profilePage = require('../pageobjects/profilePage');
const loginDialog = require('../pageobjects/loginDialog');
const toolbar = require('../pageobjects/toolbar');
const common = require('../pageobjects/common');
const testvalues = require('../../data/testvalues');

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
            console.log(`%c !!! PAGE ${pageName} IS NOT DEFINIED !!!`, 'color: #FF0000');
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
            profilePage.navigateToProfilePage(scope.page);
            break;
        default:
            console.log(`%c !!! PAGE ${pageName} IS NOT DEFINIED !!!`, 'color: #FF0000');
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
    return await group.click();
});

Then("the selected group is {string}", async groupName => {
    return await toolbar.checkSelectedGroup(scope.page, groupName, false);
});

/* ----------------
    Group Details
 ------------------*/
Then(/^"(.*)" is (a|an) (.*) of the group$/, async (userName, article, membership) => {
    console.log(`Checking if ${userName} is ${membership}`);
    return await groupDetailPage.checkUserMembership(scope.page, userName, membership);
});

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
    return await profilePage.uploadImage(scope.page, testvalues.imagePath);
});

/* ----------------
    Misc
 ------------------*/
Then(/^"(.*)" (is|are)( not|) visible$/, async (elementName, isAre, negation) => {
    let selector = getSelectorForElement(elementName);
    let visibile = negation != ' not';
    return expect(await common.isElementVisible(scope.page, selector)).toBe(visibile);
});

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
        case "group settings":
            return groupDetailPage.selector.groupSettingsCard;
        case "members card":
            return groupDetailPage.selector.groupMembersCard;
        case "games card":
            return groupDetailPage.selector.groupGamesCard;
        default:
            console.log(`%c !!! ELEMENT ${elementName} IS NOT DEFINIED !!!`, 'color: #FF0000');
    }
}