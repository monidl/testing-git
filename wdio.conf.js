const CustomReporter = require("./tests/utils/custom-reporter");

Object.assign(global, require("cucumber"));
let tags =
  process.env.CUCUMBER_TAGS != undefined && process.env.CUCUMBER_TAGS != ""
    ? process.env.CUCUMBER_TAGS + " and "
    : "";
tags = tags + "not (@ignore or @pending)";

exports.config = {
  specs: ["tests/features/*.feature"],
  capabilities: [
    {
      maxInstances: 1,
      browserName: "chrome",
      chromeOptions: {
          args: ['headless', 'disable-gpu', 'disable-dev-shm-usage', 'no-sandbox']
      }
    }
  ],
  screenshotPath: "./errorShots/",
  deprecationWarnings: false,
  waitforTimeout: 20000,
  connectionRetryTimeout: 90000,
  connectionRetryCount: 3,
  services: ["selenium-standalone"],
  framework: "cucumber",
  reporters: [CustomReporter],
  cucumberOpts: {
    compiler: ["js:babel-register"],
    require: ["./tests/steps/*.js"],
    tagExpression: tags,
    timeout: 120000
  },

  before: function() {
    global.expect = require("chai").expect;
    global.client = browser;
  }
};
