const common = require('./common');

const selector = {
    removeImageButton: 'button[name="button-remove-profile-image"]',
    uploadImageButton: 'button[name="button-upload-image"]',
    profileImage: 'img[name="image-profile"]',
    profilePlaceholder: 'i[name="placeholder-profile"]',
    profileSettingsCard: 'div[name="card-profile-settings"]'
}

async function removeProfileIfSet(page) {
    if (await common.isElementVisible(page, selector.removeImageButton)) {
        const removeButton = await page.waitForSelector(selector.removeImageButton);
        await removeButton.click();
        console.log('Profile image was found, removed');
    } else {
        console.log('Profile image was not found.');
    }
}

module.exports = {
    selector,
    removeProfileIfSet
}