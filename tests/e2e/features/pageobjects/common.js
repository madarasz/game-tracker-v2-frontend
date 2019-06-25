function delay(time) {
    return new Promise(function(resolve) { 
        setTimeout(resolve, time)
    });
}

async function isElementVisible(page, cssSelector, isXpath = false) {
    var visible = true;
    if (isXpath) {
        await page.waitForXPath(cssSelector, { visible: true, timeout: 2000 }).catch(() => {
            visible = false;
        });
    } else {
        await page.waitForSelector(cssSelector, { visible: true, timeout: 2000 }).catch(() => {
            visible = false;
        });
    }
    return visible;
};

async function clickConfirm(page) {
    const button = await page.waitForSelector(selector.buttonConfirmDialog, { visible: true });
    return button.click();
}

const selector = {
    toaster: 'div[name="toaster"]',
    profileMenu: 'a[name="menu-profile"]',
    profileImage: 'img[name="image-profile-toolbar"]',
    profilePlaceholder: 'i[name="placeholder-profile-toolbar"]',
    buttonConfirmDialog: 'button[name="button-dialog-confirm"]'
}

module.exports = {
    selector,
    isElementVisible,
    delay,
    clickConfirm
}