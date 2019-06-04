const common = require('./common');
const toolbar = require('./toolbar');
const uploadDialog = require('./uploadDialog');

const selector = {
    removeImageButton: 'button[name="button-remove-profile-image"]',
    uploadImageButton: 'button[name="button-upload-image"]',
    profileImage: 'img[name="image-profile"]',
    profilePlaceholder: 'i[name="placeholder-profile"]',
    profileSettingsCard: 'div[name="card-profile-settings"]'
}

async function removeProfileIfSet(page, force = false) {
    if (await common.isElementVisible(page, selector.removeImageButton) || force) {
        const removeButton = await page.waitForSelector(selector.removeImageButton);
        console.log('Profile image was found, removing');
        return await removeButton.click();
    } else {
        console.log('Profile image was not found.');
    }
}

async function navigateToProfilePage(page) {
    const userName = await page.waitForSelector(toolbar.selector.userName);
    await userName.click();
    const menuProfile = await page.waitForSelector(common.selector.profileMenu);
    await common.delay(200);   // have to wait here a bit
    await menuProfile.click();
    return await page.waitForSelector(selector.profileSettingsCard);
}

async function uploadImage(page, filePath) {
    console.log('Uploading image');
    const uploadButton = await page.waitForSelector(selector.uploadImageButton);
    await uploadButton.click();
    console.log('Clicked Upload')
    const fileInput = await page.waitForSelector(uploadDialog.selector.fileInput);
    await fileInput.uploadFile(filePath);
    console.log('File selected');
    const uploadDialogButton = await page.waitForSelector(uploadDialog.selector.uploadButton);
    await uploadDialogButton.click();
    console.log('File uploaded');
}

module.exports = {
    selector,
    removeProfileIfSet,
    navigateToProfilePage,
    uploadImage
}