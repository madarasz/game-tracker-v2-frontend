const common = require('./common');

const selector = {
    uploadButton: 'button[name="button-dialog-upload"]',
    cancelButton: 'button[name="button-dialog-cancel"]',
    fileInput: 'input[name="input-file"]',
    uploadImageButton: 'button[name="button-upload-image"]',
}

async function uploadImage(page, filePath) {
    return new Promise(async (done) => {
        console.log('Uploading image');
        const uploadButton = await page.waitForSelector(selector.uploadImageButton);
        await uploadButton.click();
        console.log('Clicked Upload')
        const fileInput = await page.waitForSelector(selector.fileInput);
        await fileInput.uploadFile(filePath);
        console.log('File selected');
        await common.delay(500);    // for stability
        const uploadDialogButton = await page.waitForSelector(selector.uploadButton);
        console.log('File uploading');
        await uploadDialogButton.click();
        await common.waitUntilLoaded(page);
        console.log('File uploaded');
        done();
    });
}

module.exports = {
    selector,
    uploadImage
}