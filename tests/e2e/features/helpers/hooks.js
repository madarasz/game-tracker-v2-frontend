// Hooks are fired before and after each cucumber scenario and are used
// for context setups and teardowns.

const { After, Before, AfterAll, Status } = require("cucumber");
const scope = require("./scope");

Before(async (scenario) => {
    console.log(`Test "${scenario.pickle.name}" starts, opening browser.`);
    scope.browser = await scope.driver.launch({ headless: scope.context.headless });
    scope.page = await scope.browser.newPage();
});

After(async (scenario) => {
    // taking screenshot
    if (scenario.result.status === Status.FAILED) {
        var currentdate = new Date(); 
        const dateString = `${currentdate.getFullYear()}.${padZero(currentdate.getMonth()+1)}.${padZero(currentdate.getDate())}`
            +`-${padZero(currentdate.getHours())}:${padZero(currentdate.getMinutes())}:${padZero(currentdate.getSeconds())}`;
        const scenarioName = scenario.pickle.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
        return scope.page.screenshot({path: `./tests/e2e/screenshots/${dateString}-${scenarioName}.png`});
    };

    await scope.browser.close();
});

AfterAll(async () => {
});

function padZero(number) {
    return number < 10 ? '0'+number : number;
}