const common = require('./common');

const selector = {
    uploadButton: 'button[name="button-dialog-upload"]',
    cancelButton: 'button[name="button-dialog-cancel"]',
    fileInput: 'input[name="input-file"',
    uploadImageButton: 'button[name="button-upload-image"]',
}

async function uploadImage(page, filePath) {
    console.log('Uploading image');
    const uploadButton = await page.waitForSelector(selector.uploadImageButton);
    await uploadButton.click();
    console.log('Clicked Upload')
    const fileInput = await page.waitForSelector(selector.fileInput);
    await fileInput.uploadFile(filePath);
    console.log('File selected');
    await common.delay(400);    // for stability
    const uploadDialogButton = await page.waitForSelector(selector.uploadButton);
    console.log('File uploading');
    return await uploadDialogButton.click();
}

module.exports = {
    selector,
    uploadImage
}