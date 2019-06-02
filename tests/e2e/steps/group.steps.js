import { defineFeature, loadFeature } from 'jest-cucumber';
import puppeteer from 'puppeteer';
import groupsPage from '../pageobjects/groupsPage';
import loginDialog from '../pageobjects/loginDialog';
import testvalues from '../global/testvalues';

const feature = loadFeature('./tests/e2e/features/group.selector.feature', {
    errors: {
        missingScenarioInStepDefinitions: false, // Error when a scenario is in the feature file, but not in the step definition
        missingStepInStepDefinitions: false, // Error when a step is in the feature file, but not in the step definitions
        missingScenarioInFeature: false, // Error when a scenario is in the step definitions, but not in the feature
        missingStepInFeature: false, // Error when a step is in the step definitions, but not in the feature
    }
});

defineFeature(feature, test => {
    let page;

    beforeEach(async (done) => {
        browser = await puppeteer.launch();
        console.log('Test starts, opening browser.');
        page = await browser.newPage();
        await page.goto('http://localhost:8080');
        done();
    })
    
    afterEach(async (done) => {
        browser.close();
        done();
    });

    const givenIVisit = given => {
        given(/^I visit the (.*)$/, async pageName => {
            let pagePath;
            switch (pageName) {
                case 'homepage': 
                    pagePath = '/';
                    break;
            }
            console.log(`Going to page ${pageName} with path ${pagePath}`);
            return await page.goto('http://localhost:8080' + pagePath);
        })
    }

    const iCanSeeTheFollowingGroups = then => {
        then(/^I can see the following groups in group selector:$/, async table => {
            return new Promise(async (done) => {
                for (let i = 0; i < table.length; i ++) {
                    await groupsPage.waitForGroupInTable(page, table[i].category, table[i].group);
                }
                done();
            })
        })
    }

    const iLogInWithUser = when => {
        when(/^I log in with user "(.*)"$/, async userName => {
            console.log(`Logging in with user ${userName}`);
            return await loginDialog.loginWithUser(page, testvalues.users[userName]);
        })
    }

    test("Groups with and without login", ({given, when, then}) => {
        givenIVisit(given);
        iCanSeeTheFollowingGroups(then);
        iLogInWithUser(when);
        iCanSeeTheFollowingGroups(then);
    });
});