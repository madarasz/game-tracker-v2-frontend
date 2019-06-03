const { When, Then } = require('cucumber');
const scope = require('../helpers/scope');
const groupsPage = require('../pageobjects/groupsPage');
const loginDialog = require('../pageobjects/loginDialog');
const toolbar = require('../pageobjects/toolbar');
const testvalues = require('../data/testvalues');

When(/^I visit the (.*)$/, async pageName => {
    let pagePath = 'http://localhost:8080';
    switch (pageName) {
        case "homepage":
            pagePath = pagePath + "/";
            break;
    }
    console.log(`Going to ${pageName}: ${pagePath}`);
    return await scope.page.goto(pagePath);
});

Then("I can see the following groups in group selector:", async table => {
    return new Promise(async (done) => {
        for (let i = 0; i < table.hashes().length; i ++) {
            await groupsPage.waitForGroupInTable(scope.page, table.hashes()[i].category, table.hashes()[i].group);
        }
        done();
    })
})

When("I log in with user {string}", async userName => {
    console.log(`Logging in with user ${userName}`);
    return await loginDialog.loginWithUser(scope.page, testvalues.users[userName]);
})

Then("I can see the admin icon for group {string} in category {string}", async (groupName, category) => {
    return await groupsPage.waitForAdminOnGroup(scope.page, category, groupName);
})

When("I log out", async () => {
    console.log('Logging out');
    return await toolbar.logout(scope.page);
})

When("I select group {string} in category {string}", async (groupName, category) => {
    const group = await groupsPage.waitForGroupInTable(scope.page, category, groupName);
    console.log(`${groupName} is listed, selecting`);
    return group.click();
})

Then("the selected group is {string}", async groupName => {
    return await toolbar.checkSelectedGroup(scope.page, groupName, false);
});

When("I go to path {string}", async(path) => {
    console.log(`Going to path ${path}`);
    return await scope.page.goto('http://localhost:8080'+path);
})