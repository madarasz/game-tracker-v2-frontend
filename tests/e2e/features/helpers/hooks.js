// Hooks are fired before and after each cucumber scenario and are used
// for context setups and teardowns.

const { After, Before, AfterAll } = require("cucumber");
const scope = require("./scope");

Before(async () => {
    console.log('Test starts, opening browser.');
    scope.browser = await scope.driver.launch({ headless: scope.context.headless });
    scope.page = await scope.browser.newPage();
});

After(async () => {
    await scope.browser.close();
});

AfterAll(async () => {
});