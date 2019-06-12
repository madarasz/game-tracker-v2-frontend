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

const selector = {
    toaster: 'div[name="toaster"]',
    profileMenu: 'a[name="menu-profile"]',
    profileImage: 'img[name="image-profile-toolbar"]',
    profilePlaceholder: 'i[name="placeholder-profile-toolbar"]',
}

module.exports = {
    selector,
    isElementVisible,
    delay
}