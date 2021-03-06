const { setWorldConstructor, setDefaultTimeout } = require("cucumber");
const puppeteer = require("puppeteer");
const scope = require("./scope");

const World = function({attach, parameters}) {
  scope.driver = puppeteer;
  scope.context = parameters;
  scope.attach = attach;
};

setDefaultTimeout(10 * 1000);
setWorldConstructor(World);