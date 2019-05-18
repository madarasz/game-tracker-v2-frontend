const isDev = false;

module.exports = {
  launch: {
    //dumpio: true,
    // slowMo: 1200,
    headless: !isDev,
    executablePath: isDev ? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' : undefined,
  },
}