const { setWorldConstructor, setDefaultTimeout } = require("cucumber");
const puppeteer = require("puppeteer");
const scope = require("./scope");

const World = function() {
  scope.driver = puppeteer;
  scope.context = {};
};

setDefaultTimeout(10 * 1000);
setWorldConstructor(World);