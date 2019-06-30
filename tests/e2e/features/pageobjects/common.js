async function delay(time) {
    return await new Promise(function(resolve) { 
        setTimeout(resolve, time)
    });
}

async function isElementVisible(page, selectorVal, isXpath = false) {
    var visible = true;
    if (isXpath) {
        await page.waitForXPath(selectorVal, { visible: true, timeout: 2000 }).catch(() => {
            visible = false;
        });
    } else {
        await page.waitForSelector(selectorVal, { visible: true, timeout: 2000 }).catch(() => {
            visible = false;
        });
    }
    return visible;
};

async function clickConfirm(page) {
    console.log('Confirming action on dialog');
    const button = await page.waitForSelector(selector.buttonConfirmDialog, { visible: true });
    return await button.click();
}

async function typeValueIn(page, selector, value) {
    const input = await page.waitForSelector(selector);
    await input.click({clickCount: 3}); // selecting existing value for deletion
    return await input.type(value);
}

async function waitUntilLoaded(page, retries = 10) {
    return new Promise(async (done) => {
        let loading = true;
        let count = 0;
        while (loading && count < retries) {
            loading = false;
            count++;
            await page.waitForSelector(selector.loadingAnimation, { visible: true, timeout: 300 }).then(async () => {
                console.log('page still loading...');
                loading = true;
                await delay(300);
            }).catch(() => {
                console.log('loading done');
                done();
            });
        }
        if (loading) {
            console.log('too many tries, aborting');
            done();
        }
    });
}

const selector = {
    toaster: 'div[name="toaster"]',
    profileMenu: 'a[name="menu-profile"]',
    profileImage: 'img[name="image-profile-toolbar"]',
    profilePlaceholder: 'i[name="placeholder-profile-toolbar"]',
    buttonConfirmDialog: 'button[name="button-dialog-confirm"]',
    loadingAnimation: 'div[role="progressbar"]'
}

module.exports = {
    selector,
    isElementVisible,
    delay,
    clickConfirm,
    typeValueIn,
    waitUntilLoaded
}